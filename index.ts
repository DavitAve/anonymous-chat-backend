import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);

initSocket(server);

app.get("/", (_, res) => {
  res.send("Server is running!");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
