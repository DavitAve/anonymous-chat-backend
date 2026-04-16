import { Server } from "socket.io";
import { registerHandlers } from "./handlers";
import { startMatchmakingLoop } from "../services/matchmaker.service";

export function initSocket(server: any) {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.TELEGRAM_APP_URL,
    process.env.FRONTEND_URL_SECOND,
    process.env.MOBILE_URL,
  ].filter(Boolean) as string[];

  const io = new Server(server, {
    cors: {
      // Динамическая проверка: разрешаем если адрес в списке или если это мобилка (нет origin)
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          // callback(null, true); // for all
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log(`🚀 Socket.io настроен для работы`);

  startMatchmakingLoop(io);

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
