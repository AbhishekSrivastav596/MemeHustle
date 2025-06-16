const MemeCard = ({ meme, socket }) => {
  const upvote = () => {
    fetch("http://localhost:5000/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meme_id: meme.id }),
    }).then(() => socket.emit("vote")).catch(err => console.error("Fetch error:", err));

  };

  return (
    <div className="border border-pink-500 p-4 rounded-xl shadow-lg hover:shadow-pink-300 transition duration-300">
      <img
  src={meme.image_url}
  alt="meme"
  className="w-4000 h-64 object-cover rounded-md"
/>

      <div className="mt-3">
        <h2 className="text-xl font-bold text-white">{meme.title}</h2>
        <p className="text-pink-300 text-sm mt-1">Tags: {meme.tags.join(", ")}</p>
        <p className="text-white text-sm mt-1">Upvotes: {meme.upvotes}</p>
        <button onClick={upvote} className="neon-button">🚀 Upvote</button>
      </div>
    </div>
  );
};

export default MemeCard;
