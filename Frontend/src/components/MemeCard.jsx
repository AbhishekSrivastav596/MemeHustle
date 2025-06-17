import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const MemeCard = ({ meme, socket, onVote }) => {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [localBid, setLocalBid] = useState(meme.currentBid || null);
  const [caption, setCaption] = useState("Click ⚡ AI to generate a caption...");
  const [loadingCaption, setLoadingCaption] = useState(false);

  const vote = async (type) => {
    await fetch("https://memehustle-9e0c.onrender.com/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meme_id: meme.id, type }),
    });
    socket.emit("vote");
    onVote(meme.id, type);
  };

  const placeBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) return alert("Enter a valid number");

    await fetch(`https://memehustle-9e0c.onrender.com/memes/${meme.id}/bid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credits: bidAmount, user_id: "cyberpunk420" }),
    });

    socket.emit("place-bid", {
      meme_id: meme.id,
      credits: bidAmount,
      user_id: "cyberpunk420",
    });

    setLocalBid(bidAmount);
    setShowBidModal(false);
    setBidAmount("");
  };

  const fetchCaption = async () => {
    setLoadingCaption(true);
    try {
      const res = await fetch("https://memehustle-9e0c.onrender.com/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: meme.tags }),
      });
      const json = await res.json();
      setCaption(json.caption);
    } catch (err) {
      setCaption("⚠️ Failed to load caption");
    }
    setLoadingCaption(false);
  };

  return (
    <>
      <div className="w-[500px] h-[340px] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col relative">
        <div className="overflow-hidden">
          <img
            src={meme.image_url || "https://picsum.photos/600"}
            alt={meme.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-col justify-between flex-1 p-3 text-xs">
          <div>
            <h3 className="text-base font-semibold text-gray-800 truncate">{meme.title}</h3>
            <p className="text-[11px] text-gray-500 truncate">Tags: {meme.tags.join(", ")}</p>
            <p className="text-sm mt-1 text-gray-700">🔥 {meme.upvotes} upvotes</p>
            {localBid && (
              <p className="text-sm mt-1 text-green-600 font-medium">💰 {localBid} credits</p>
            )}
            <p className="text-[11px] mt-2 italic text-gray-600 h-[40px] overflow-y-auto">
              {loadingCaption ? "🤖 Generating caption..." : caption}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-1 mt-2">
            <button
              onClick={() => vote("up")}
              className="bg-green-500 text-white text-xs py-1 rounded-full hover:bg-green-600"
            >
              ⬆
            </button>
            <button
              onClick={() => vote("down")}
              className="bg-red-500 text-white text-xs py-1 rounded-full hover:bg-red-600"
            >
              ⬇
            </button>
            <button
              onClick={() => setShowBidModal(true)}
              className="bg-yellow-400 text-black text-xs py-1 rounded-full hover:bg-yellow-300"
            >
              💸
            </button>
            <button
              onClick={fetchCaption}
              className="bg-blue-500 text-white text-xs py-1 rounded-full hover:bg-blue-600"
            >
              ⚡
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showBidModal} onClose={() => setShowBidModal(false)}>
        <DialogTitle>Place Your Bid</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Credits"
            type="number"
            fullWidth
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBidModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={placeBid} variant="contained" color="warning">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MemeCard;
