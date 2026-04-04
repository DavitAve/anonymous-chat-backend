import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import voteRoutes from "./routes/vote.routes";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/votes", voteRoutes);

const server = http.createServer(app);

initSocket(server);

// Вызываем подключение к базе данных
connectDB();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});