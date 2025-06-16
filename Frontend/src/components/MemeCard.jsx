const MemeCard = ({ meme, socket }) => {
  const upvote = () => {
    fetch("http://localhost:5000/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meme_id: meme.id }),
    })
      .then(() => socket.emit("vote"))
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
<div className="border border-pink-500 p-4 rounded-xl bg-black shadow-[0_0_15px_#ff00ff50] hover:shadow-[0_0_25px_#ff00ffaa] transition duration-300">
      <img
        src={meme.image_url || "https://picsum.photos/400"}
        className="w-full h-64 object-cover rounded-md border border-purple-500"
      />
      <h2 className="text-2xl text-white mt-3">{meme.title}</h2>
      <p className="text-sm text-pink-300">Tags: {meme.tags.join(", ")}</p>
      <p className="text-white">🔥 {meme.upvotes} upvotes</p>
  <button onClick={upvote} className="neon-button">🚀 Upvote</button>
    </div>
  );
};

export default MemeCard;
