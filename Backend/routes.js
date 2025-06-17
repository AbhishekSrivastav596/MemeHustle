const { supabase } = require("./supabase");
require("dotenv").config();
const { generateMemeCaption } = require("./ai");

const leaderboardCache = { memes: [] };
const aiCache = {};

function setupRoutes(app) {
  app.post("/memes", async (req, res) => {
    const { title, image_url, tags, owner_id } = req.body;
    const { data, error } = await supabase.from("memes").insert([{ title, image_url, tags, upvotes: 0, owner_id }]);
    res.send({ data, error });
  });

app.get("/memes", async (req, res) => {
  try {
    const { data: memes, error: memeError } = await supabase.from("memes").select("*");
    if (memeError) throw memeError;

    const { data: bids, error: bidError } = await supabase
      .from("bids")
      .select("meme_id, credits")
      .order("credits", { ascending: false });

    if (bidError) throw bidError;
    const memeMap = {};
    for (const bid of bids) {
      if (!memeMap[bid.meme_id]) memeMap[bid.meme_id] = bid.credits;
    }
    const enriched = memes.map(meme => ({
      ...meme,
      currentBid: memeMap[meme.id] || null,
    }));

    res.send(enriched);
  } catch (err) {
    console.error("Fetch memes error:", err.message);
    res.status(500).send({ error: err.message });
  }
});


app.post("/vote", async (req, res) => {
  try {
    const { meme_id, type } = req.body;
    const increment = type === "up" ? 1 : -1;
    const { error } = await supabase.rpc("adjust_votes", {
      meme_id_input: meme_id,
      delta: increment,
    });
    if (error) throw error;
    res.send({ success: true });
  } catch (err) {
    console.error("Vote error:", err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

  app.get("/leaderboard", async (req, res) => {
    const { data } = await supabase
      .from("memes")
      .select("*")
      .order("upvotes", { ascending: false })
      .limit(10);
    leaderboardCache.memes = data;
    res.send(data);
  });

app.post("/generate-caption", async (req, res) => {
  try {
    const { tags } = req.body;
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: "Invalid or missing tags array" });
    }

    const caption = await generateMemeCaption(tags);
    console.log("Generated Caption:", caption);

    res.json({ caption });
  } catch (err) {
    console.error("Caption API error:", err.message);
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

  app.post("/memes/:id/bid", async (req, res) => {
  const { id } = req.params;
  const { credits, user_id = "cyberpunk420" } = req.body;

  try {
    const { data, error } = await supabase.from("bids").insert([
      {
        meme_id: id,
        user_id,
        credits: parseInt(credits)
      }
    ]);

    if (error) {
      console.error("Bid error:", error.message);
      return res.status(500).send({ success: false, error: error.message });
    }
    req.io?.emit?.("new-bid", { meme_id: id, credits, user_id });

    res.send({ success: true, data });
  } catch (err) {
    console.error("Bid exception:", err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});
}



module.exports = { setupRoutes };
