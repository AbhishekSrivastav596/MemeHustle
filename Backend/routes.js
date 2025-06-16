const { supabase } = require("./supabase");

const leaderboardCache = { memes: [] };
const aiCache = {};

function setupRoutes(app) {
  app.post("/memes", async (req, res) => {
    const { title, image_url, tags, owner_id } = req.body;
    const { data, error } = await supabase.from("memes").insert([{ title, image_url, tags, upvotes: 0, owner_id }]);
    res.send({ data, error });
  });

  app.get("/memes", async (req, res) => {
    const { data } = await supabase.from("memes").select("*");
    res.send(data);
  });

app.post("/vote", async (req, res) => {
  try {
    const { meme_id } = req.body;
    const { error } = await supabase.rpc("increment_upvotes", {
      meme_id_input: meme_id,
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
    const { tags } = req.body;
    const prompt = `Funny caption for meme with tags: ${tags.join(", ")}`;
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const json = await geminiRes.json();
      const caption = json.candidates?.[0]?.content?.parts?.[0]?.text || "HODL the vibes!";
      aiCache[tags.join(",")] = caption;
      res.send({ caption });
    } catch (err) {
      res.send({ caption: "YOLO to the moon!" });
    }
  });
}

module.exports = { setupRoutes };
