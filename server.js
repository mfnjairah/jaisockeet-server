const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const domain = ["https://jaisocket.netlify.app"];

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: domain,
  },
});

const corsOptions = {
  origin: domain,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Worked again.");
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("content_change", (data) => {
    socket.broadcast.emit("received_change", data);
  });

  socket.on("change_content", (data) => {
    socket.broadcast.emit("changed", data);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
