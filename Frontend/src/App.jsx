import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

import MemeCard from "./components/MemeCard";
import CreateMeme from "./components/CreateMeme";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Leaderboard from "./components/LeaderBoard";

const socket = io("http://localhost:5000");

function Marketplace() {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/memes").then(res => res.json()).then(setMemes);

    socket.on("new-bid", bid => {
      setMemes(prev =>
        prev.map(m => (m.id === bid.meme_id ? { ...m, currentBid: bid.credits } : m))
      );
    });

    socket.on("vote-update", () => {
      fetch("http://localhost:5000/memes").then(res => res.json()).then(setMemes);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <main className="px-4 sm:px-10 py-6">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold glitch">🔥 MemeHustle</h1>
        <p className="mt-2 text-pink-300 text-lg">Welcome to the cyberpunk meme market</p>
      </header>

      <CreateMeme onCreate={setMemes} />

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {memes.map(meme => (
          <MemeCard key={meme.id} meme={meme} socket={socket} />
        ))}
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Marketplace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
