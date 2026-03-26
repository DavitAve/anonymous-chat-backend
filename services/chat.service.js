"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChatId = void 0;
exports.addMessage = addMessage;
exports.getHistory = getHistory;
exports.clearChat = clearChat;
const store_1 = require("../store");
const generateChatId = () => {
    return Date.now().toString() + "_" + Math.random().toString(36);
};
exports.generateChatId = generateChatId;
function addMessage(chatId, message) {
    if (!store_1.chatHistory.has(chatId)) {
        store_1.chatHistory.set(chatId, []);
    }
    store_1.chatHistory.get(chatId).push(message);
}
function getHistory(chatId) {
    return store_1.chatHistory.get(chatId) || [];
}
function clearChat(chatId) {
    store_1.chatHistory.delete(chatId);
}
