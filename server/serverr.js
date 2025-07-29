import express from "express";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const rooms = {}; // roomId → { players: { socketId → state } }

io.on("connection", (socket) => {
  socket.on("joinroom", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = { players: {} };
    rooms[roomId].players[socket.id] = { x: 0, y: 0, avataridx: 0 };

    const roomPlayers = rooms[roomId].players;

    socket.emit("otherplayers", roomPlayers);
    socket.to(roomId).emit("currentplayer", {
      id: socket.id,
      state: roomPlayers[socket.id],
    });

    socket.on("move", (data) => {
      rooms[roomId].players[socket.id] = {
        x: data.x,
        y: data.y,
        avataridx: data.avataridx,
      };
      socket.to(roomId).emit("playermove", {
        id: socket.id,
        state: rooms[roomId].players[socket.id],
        dir: data.direction,
      });
    });

    socket.on("disconnect", () => {
      delete rooms[roomId].players[socket.id];
      io.to(roomId).emit("playerdisconnect", socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
