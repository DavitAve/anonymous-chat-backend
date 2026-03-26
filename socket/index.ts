import { Server } from "socket.io";
import { registerHandlers } from "./handlers";

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    registerHandlers(io, socket);
  });

  return io;
}
