import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    fetch("https://memehustle-9e0c.onrender.com/leaderboard")
      .then(res => res.json())
      .then(setTopMemes);
  }, []);

  return (
    <div className="text-white min-h-screen px-4 sm:px-6 lg:px-16 py-10">
      <h1 className="text-4xl text-center font-bold mb-10 text-pink-400 glitch">🏆 Meme Leaderboard</h1>

      <div className="overflow-x-auto shadow-lg border border-pink-500/40 rounded-xl">
        {topMemes.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No memes yet. Be the first to post!</p>
        ) : (
          <table className="min-w-full divide-y divide-pink-600/40">
            <thead className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Meme Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">Tags</th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-white">Upvotes</th>
              </tr>
            </thead>
            <tbody className="bg-black/30 divide-y divide-pink-700/30">
              {topMemes.map((meme, index) => (
                <tr key={meme.id} className="hover:bg-pink-900/10 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-cyan-400">#{index + 1}</td>
                  <td className="px-6 py-4 font-semibold text-white">{meme.title}</td>
                  <td className="px-6 py-4 text-pink-300 text-sm">{meme.tags.join(", ")}</td>
                  <td className="px-6 py-4 text-right font-bold text-yellow-400">🔥 {meme.upvotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
