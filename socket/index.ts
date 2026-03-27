import { Server } from "socket.io";
import { registerHandlers } from "./handlers";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);
    registerHandlers(io, socket);
  });

  return io;
}
