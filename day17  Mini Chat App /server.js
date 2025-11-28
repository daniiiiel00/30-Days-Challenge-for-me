const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Map to track connected users and their usernames
const users = new Map();

// Serve the public folder where your chat_app.html is located
app.use(express.static(path.join(__dirname, "public")));

// Fallback for the root path
app.get("/", (req, res) => {
  // Assuming the client file is named 'chat_app.html' and is in the 'public' directory
  res.sendFile(path.join(__dirname, "public", "chat_app.html"));
});

io.on("connection", (socket) => {
  // Listener for when a user sets their username
  socket.on("set user", (username) => {
    const userId = socket.id;
    users.set(userId, username);

    // Notify everyone that a new user has joined
    const joinMessage = `${username} joined the chat`;
    io.emit("chat notification", joinMessage);
  });

  // Listener for incoming chat messages
  socket.on("chat message", (msg) => {
    const username = users.get(socket.id) || "Anonymous";

    // Broadcast the message to all clients, including the sender
    io.emit("chat message", {
      user: username,
      text: msg,
      timestamp: new Date().toLocaleTimeString(),
      self: socket.id,
      id: socket.id,
    });
  });

  // Listener for client disconnection
  socket.on("disconnect", () => {
    const userId = socket.id;
    const username = users.get(userId);

    if (username) {
      // Notify everyone that a user has left
      const leaveMessage = `${username} left the chat`;
      io.emit("chat notification", leaveMessage);
      users.delete(userId);
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    'To start, run "npm install express socket.io" and then "node server.js"'
  );
});
