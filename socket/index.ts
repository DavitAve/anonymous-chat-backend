import { Server } from "socket.io";
import { registerHandlers } from "./handlers";

export function initSocket(server: any) {
  const frontendUrl = process.env.NODE_ENV === 'development' ? process.env.FRONTEND_URL_DEV  : process.env.FRONTEND_URL;

  const io = new Server(server, {
    cors: {
      origin: frontendUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log(`🚀 Socket.io настроен для работы с: ${frontendUrl}`);

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    registerHandlers(io, socket);

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
    });
  });

  return io;
}
