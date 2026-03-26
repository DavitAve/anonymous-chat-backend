"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlers = registerHandlers;
const store_1 = require("../store");
const match_service_1 = require("../services/match.service");
const chat_service_1 = require("../services/chat.service");
function registerHandlers(io, socket) {
    const userId = socket.handshake.auth.userId;
    store_1.users.set(userId, socket.id);
    io.emit("online_count", store_1.users.size);
    if (store_1.disconnectTimers.has(userId)) {
        clearTimeout(store_1.disconnectTimers.get(userId));
        store_1.disconnectTimers.delete(userId);
    }
    // RECONNECT
    const chatData = store_1.activeChats.get(userId);
    if (chatData) {
        const history = (0, chat_service_1.getHistory)(chatData.chatId);
        socket.emit("chat_history", history);
    }
    // MESSAGE
    socket.on("send_message", ({ text }) => {
        const chatData = store_1.activeChats.get(userId);
        if (!chatData)
            return;
        (0, chat_service_1.addMessage)(chatData.chatId, { text, senderId: userId });
        const partnerSocket = store_1.users.get(chatData.partnerId);
        if (partnerSocket) {
            io.to(partnerSocket).emit("receive_message", {
                text,
                senderId: userId,
            });
        }
    });
    // SEARCH
    socket.on("start_search", (data) => {
        const user = {
            userId,
            age: data.age,
            gender: data.gender,
            partnerAges: Array.isArray(data.partnerAges)
                ? data.partnerAges
                : [data.partnerAges],
            partnerGender: data.partnerGender,
        };
        (0, match_service_1.removeFromQueue)(userId);
        const matchIndex = store_1.queue.findIndex((u) => (0, match_service_1.isMatch)(u, user));
        if (matchIndex !== -1) {
            const matchedUser = store_1.queue.splice(matchIndex, 1)[0];
            const chatId = (0, chat_service_1.generateChatId)();
            store_1.activeChats.set(userId, {
                partnerId: matchedUser.userId,
                chatId,
            });
            store_1.activeChats.set(matchedUser.userId, {
                partnerId: userId,
                chatId,
            });
            store_1.chatHistory.set(chatId, []);
            const partnerSocket = store_1.users.get(matchedUser.userId);
            io.to(socket.id).emit("match_found");
            if (partnerSocket) {
                io.to(partnerSocket).emit("match_found");
            }
        }
        else {
            store_1.queue.push(user);
        }
    });
    // LEAVE
    socket.on("leave_chat", () => {
        const chatData = store_1.activeChats.get(userId);
        if (!chatData)
            return;
        const partnerSocket = store_1.users.get(chatData.partnerId);
        if (partnerSocket) {
            io.to(partnerSocket).emit("partner_left");
        }
        (0, chat_service_1.clearChat)(chatData.chatId);
        store_1.activeChats.delete(chatData.partnerId);
        store_1.activeChats.delete(userId);
    });
    // DISCONNECT
    socket.on("disconnect", () => {
        const timer = setTimeout(() => {
            store_1.users.delete(userId);
            io.emit("online_count", store_1.users.size);
            const chatData = store_1.activeChats.get(userId);
            if (!chatData)
                return;
            const partnerSocket = store_1.users.get(chatData.partnerId);
            if (partnerSocket) {
                io.to(partnerSocket).emit("partner_left");
            }
            store_1.activeChats.delete(chatData.partnerId);
            store_1.activeChats.delete(userId);
        }, 5000);
        store_1.disconnectTimers.set(userId, timer);
    });
}
