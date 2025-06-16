import { useState } from "react";

export default function CreateMeme({ onCreate }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");

  const handleCreate = async () => {
    await fetch("http://localhost:5000/memes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, image_url: url, tags: tags.split(","), owner_id: "neo123" }),
    });
    const newMemes = await fetch("http://localhost:5000/memes").then(r => r.json());
    onCreate(newMemes);
    setTitle(""); setUrl(""); setTags("");
  };

  return (
    <div className=" p-6 mt-6 rounded-lg shadow-lg text-white border border-pink-500">
      <h2 className="text-2xl font-bold  mb-4">🚀 Create Your Meme</h2>
      <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Meme Title" />
      <input className="input" value={url} onChange={e => setUrl(e.target.value)} placeholder="Image URL" />
      <input className="input" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
      <button onClick={handleCreate} className="neon-button">Post Meme</button>
    </div>
  );
}
