import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/leaderboard")
      .then(res => res.json())
      .then(setTopMemes);
  }, []);

  return (
    <div className="text-white min-h-screen px-6 py-10">
      <h1 className="text-4xl text-center font-bold mb-8 text-pink-400">🏆 Leaderboard</h1>

      <div className="max-w-4xl  mx-auto border border-pink-500 rounded-xl shadow-xl p-6">
        {topMemes.length === 0 ? (
          <p className="text-center glitch text-gray-400">No memes yet. Be the first to post!</p>
        ) : (
          <ul className="space-y-4">
            {topMemes.map((meme, index) => (
              <li
                key={meme.id}
                className=" p-4 rounded-lg shadow-md hover:shadow-pink-500 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      #{index + 1} - {meme.title}
                    </p>
                    <p className="text-pink-300 text-sm">Tags: {meme.tags.join(", ")}</p>
                  </div>
                  <p className="text-neonBlue font-semibold">🔥 {meme.upvotes} upvotes</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
