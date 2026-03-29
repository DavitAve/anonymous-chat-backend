import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { initSocket } from "./socket";
import { connectDB } from "./config/db";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send("OK");
});

const server = http.createServer(app);

initSocket(server);

// Вызываем подключение к базе данных
connectDB();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
