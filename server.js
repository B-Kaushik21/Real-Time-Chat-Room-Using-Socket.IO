// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set username", (username) => {
    users[socket.id] = username;
    socket.broadcast.emit("user joined", `${username} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous";
    io.emit("chat message", { username, msg });
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit("user left", `${username} left the chat`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
