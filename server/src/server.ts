import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";

import connectDB from "./config/db.js";
import app from "./app.js";

import http from "http";
import { Socket } from "socket.io";
import { initSocket } from "./socket.js";

interface OfferPayload {
  targetId: string;
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

interface AnswerPayload {
  targetId: string;
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  targetId: string;
  roomId: string;
  candidate: RTCIceCandidateInit;
}

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

export const io = initSocket(server);

io.on("connection", (socket: Socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (roomId: string) => {
    try {
      const room = io.sockets.adapter.rooms.get(roomId);
      const numberOfClients = room ? room.size : 0;

      socket.join(roomId);

      if (numberOfClients === 1) {
        const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) ?? []);
        const firstPeerId = socketsInRoom.find((id) => id !== socket.id) || socketsInRoom[0];

        if (firstPeerId) {
          io.to(firstPeerId).emit("ready-to-offer", { newPeerId: socket.id });
        }
      }
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
    }
  });

  socket.on("offer", (payload: OfferPayload) => {
    io.to(payload.targetId).emit("offer", { from: socket.id, offer: payload.offer });
  });

  socket.on("answer", (payload: AnswerPayload) => {
    io.to(payload.targetId).emit("answer", { from: socket.id, answer: payload.answer });
  });

  socket.on("ice-candidate", (payload: IceCandidatePayload) => {
    io.to(payload.targetId).emit("ice-candidate", { from: socket.id, candidate: payload.candidate });
  });

  socket.on("register-user", (userId: string) => {
    socket.join(userId);
    console.log("User joined notification room:", userId, "socket:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});