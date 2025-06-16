import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-pink-500">
      <Link to="/" className="text-2xl font-extrabold glitch hover:text-pink-300 transition">MemeHustle</Link>
      <div className="space-x-4 text-sm sm:text-base">
        <Link to="/app" className="hover:text-pink-400">Marketplace</Link>
        <Link to="/leaderboard" className="hover:text-pink-400">Leaderboard</Link>
      </div>
    </nav>
  );
}
