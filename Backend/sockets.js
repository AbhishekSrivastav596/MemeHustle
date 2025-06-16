function setupSockets(io) {
  io.on("connection", socket => {
    console.log("User connected");

    socket.on("place-bid", bid => {
      io.emit("new-bid", bid);
    });

    socket.on("vote", vote => {
      io.emit("vote-update", vote);
    });
  });
}

module.exports = { setupSockets };
