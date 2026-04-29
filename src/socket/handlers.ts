import { Server, Socket } from "socket.io";
import { users, activeChats, queue, disconnectTimers } from "../store";
import { removeFromQueue } from "../services/match.service";
import { addMessage, getHistory, clearChat } from "../services/chat.service";
import { QueueUser } from "../types/search";
import { getCurrentOnlineCount } from "../services/online.service";

export function registerHandlers(io: Server, socket: Socket) {
  const userId: string = socket.handshake.auth.userId;

  users.set(userId, socket.id);
  // УДАЛЕНО: io.emit("online_count", users.size); Теперь спамит сервис

  if (disconnectTimers.has(userId)) {
    clearTimeout(disconnectTimers.get(userId)!);
    disconnectTimers.delete(userId);
  }

  // MESSAGE
  socket.on("send_message", ({ text }, callback) => {
    const chatData = activeChats.get(userId);

    if (!chatData) {
      if (typeof callback === "function") callback({ status: "error" });
      socket.emit("partner_left");
      return;
    }

    const timestamp = Date.now();
    const messageData = { text, senderId: userId, timestamp };

    addMessage(chatData.chatId, messageData);

    const partnerSocket = users.get(chatData.partnerId);
    if (partnerSocket) {
      io.to(partnerSocket).emit("receive_message", messageData);
    }

    if (typeof callback === "function") callback({ status: "ok", timestamp });
  });

  // SEARCH
  socket.on("start_search", (data) => {
    // ЗАЩИТА ОТ БАГОВ: Если юзер начал новый поиск, но застрял в старом чате (из-за релоада)
    const existingChat = activeChats.get(userId);
    if (existingChat) {
      const partnerSocket = users.get(existingChat.partnerId);
      if (partnerSocket) io.to(partnerSocket).emit("partner_left");
      clearChat(existingChat.chatId);
      activeChats.delete(existingChat.partnerId);
      activeChats.delete(userId);
    }

    const user: QueueUser = {
      socketId: socket.id,
      userId: userId,
      age: data.age,
      gender: data.gender,
      partnerAges: Array.isArray(data.partnerAges)
        ? data.partnerAges
        : [data.partnerAges],
      partnerGender: data.partnerGender,

      isPremium: data.isPremium || false,
      traits: data.traits || {
        energy: 5,
        talkativeness: 5,
        logic: 5,
        interests: [],
      },
      joinedAt: Date.now(),
    };

    removeFromQueue(userId);
    queue.push(user);
  });

  // LEAVE
  socket.on("leave_chat", (callback) => {
    const chatData = activeChats.get(userId);

    if (chatData) {
      const partnerSocket = users.get(chatData.partnerId);

      if (partnerSocket) {
        io.to(partnerSocket).emit("partner_left");
      }

      clearChat(chatData.chatId);
      activeChats.delete(chatData.partnerId);
      activeChats.delete(userId);
    }

    // Сообщаем фронтенду, что всё очищено и можно безопасно уходить
    if (typeof callback === "function") {
      callback();
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    removeFromQueue(userId);

    const timer = setTimeout(() => {
      users.delete(userId);
      // УДАЛЕНО: io.emit("online_count", users.size); Теперь спамит сервис

      const chatData = activeChats.get(userId);
      if (!chatData) return;

      const partnerSocket = users.get(chatData.partnerId);

      if (partnerSocket) {
        io.to(partnerSocket).emit("partner_left");
      }

      activeChats.delete(chatData.partnerId);
      activeChats.delete(userId);
    }, 5000);

    disconnectTimers.set(userId, timer);
  });

  // TYPING
  socket.on("typing", () => {
    const chatData = activeChats.get(userId);
    if (!chatData) return;

    const partnerSocket = users.get(chatData.partnerId);
    if (partnerSocket) {
      io.to(partnerSocket).emit("typing");
    }
  });

  // STOP TYPING
  socket.on("stop_typing", () => {
    const chatData = activeChats.get(userId);
    if (!chatData) return;

    const partnerSocket = users.get(chatData.partnerId);
    if (partnerSocket) {
      io.to(partnerSocket).emit("stop_typing");
    }
  });

  socket.on("check_active_chat", () => {
    const chatData = activeChats.get(userId);

    if (!chatData) {
      socket.emit("no_active_chat");
    } else {
      const history = getHistory(chatData.chatId);
      socket.emit("chat_history", history);
    }
  });

  // Когда юзер только зашел, отдаем ему красивую цифру сразу, не заставляя ждать 2.5 сек
  socket.on("request_online_count", () => {
    socket.emit("online_count", getCurrentOnlineCount());
  });

  // CANCEL SEARCH
  socket.on("cancel_search", () => {
    removeFromQueue(userId);
  });
}
