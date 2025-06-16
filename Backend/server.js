const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { setupRoutes } = require("./routes");
const { setupSockets } = require("./sockets");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

setupRoutes(app);
setupSockets(io);

server.listen(5000, () => console.log("Server running at http://localhost:5000"));
