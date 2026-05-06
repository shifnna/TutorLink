import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";

import connectDB from "./config/db";
import app from "./app";

import http from "http";
import { Server, Socket } from "socket.io";


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

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", (roomId: string) => {
    try {
      const room = io.sockets.adapter.rooms.get(roomId);
      const numberOfClients = room ? room.size : 0;

      console.log(
        `Socket ${socket.id} joining room ${roomId} (present before join: ${numberOfClients})`
      );

      socket.join(roomId);

      if (numberOfClients === 1) {
        const socketsInRoom = Array.from(
          io.sockets.adapter.rooms.get(roomId) ?? []
        );
        const firstPeerId =
          socketsInRoom.find((id) => id !== socket.id) || socketsInRoom[0];

        if (firstPeerId) {
          console.log(
            `Notifying first peer ${firstPeerId} that ${socket.id} joined`
          );
          io.to(firstPeerId).emit("ready-to-offer", { newPeerId: socket.id });
        }
      } else if (numberOfClients === 0) {
        console.log("First peer in room (waiting for another):", socket.id);
      } else {
        console.log(
          `Room ${roomId} now has ${numberOfClients + 1} clients (NOT supported for 1:1 video).`
        );
      }
    } catch (err) {
      console.error("join-room error:", err);
    }
  });

  socket.on("offer", (payload: OfferPayload) => {
    console.log(`Offer ${socket.id} -> ${payload.targetId}`);
    io.to(payload.targetId).emit("offer", {
      from: socket.id,
      offer: payload.offer,
    });
  });

  socket.on("answer", (payload: AnswerPayload) => {
    console.log(`Answer ${socket.id} -> ${payload.targetId}`);
    io.to(payload.targetId).emit("answer", {
      from: socket.id,
      answer: payload.answer,
    });
  });

  socket.on("ice-candidate", (payload: IceCandidatePayload) => {
    io.to(payload.targetId).emit("ice-candidate", {
      from: socket.id,
      candidate: payload.candidate,
    });
  });

  socket.on("register-user", (userId: string) => {
    socket.join(userId);
    console.log(
      "User joined notification room:",
      userId,
      "socket:",
      socket.id
    );
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
