import express from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import { initSocket } from "./socket";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.get("/", (_, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
