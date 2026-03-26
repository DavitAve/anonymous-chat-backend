"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const handlers_1 = require("./handlers");
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        (0, handlers_1.registerHandlers)(io, socket);
    });
    return io;
}
