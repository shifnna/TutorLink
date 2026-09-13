import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server;

export function initSocket(server: HTTPServer) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io accessed before initSocket() was called.");
  }
  return io;
}