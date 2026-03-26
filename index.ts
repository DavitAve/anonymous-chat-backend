import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    console.log(`User connected to socket: ${socket.id}`);

    socket.on("message", (data) => {
      console.log("New message:", data);
      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
