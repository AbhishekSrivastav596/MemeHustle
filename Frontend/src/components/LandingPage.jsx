import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl glitch font-extrabold mb-6">🔥 MemeHustle</h1>
      <p className="text-xl text-pink-300 mb-8 max-w-xl">
        Enter the neon meme matrix — create, battle, and trade memes in real-time with AI-powered vibes.
      </p>
      <Link to="/app">
        <button className="neon-button text-lg">Enter Marketplace 🚀</button>
      </Link>
    </div>
  );
}
