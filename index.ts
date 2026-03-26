import express from "express";
import http from "http";
import cors from "cors";
import { initSocket } from "./socket";

const app = express();
app.use(cors());

const server = http.createServer(app);

initSocket(server);

app.get("/", (_, res) => {
  res.send("Server is running!");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on 3000");
});
