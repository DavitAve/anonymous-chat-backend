"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./socket");
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
app.get("/", (_, res) => {
    res.send("Server is running!");
});
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});
