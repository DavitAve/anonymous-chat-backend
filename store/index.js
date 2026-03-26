"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHistory = exports.disconnectTimers = exports.activeChats = exports.users = exports.queue = void 0;
exports.setQueue = setQueue;
exports.queue = [];
function setQueue(newQueue) {
    exports.queue = newQueue;
}
exports.users = new Map();
exports.activeChats = new Map();
exports.disconnectTimers = new Map();
exports.chatHistory = new Map();
