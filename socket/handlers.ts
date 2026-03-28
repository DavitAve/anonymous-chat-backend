import { Server, Socket } from "socket.io";
import {
  users,
  activeChats,
  queue,
  chatHistory,
  disconnectTimers,
} from "../store";
import { isMatch, removeFromQueue } from "../services/match.service";
import {
  generateChatId,
  addMessage,
  getHistory,
  clearChat,
} from "../services/chat.service";
import { User } from "../types";

export function registerHandlers(io: Server, socket: Socket) {
  const userId: string = socket.handshake.auth.userId;

  users.set(userId, socket.id);
  io.emit("online_count", users.size);

  if (disconnectTimers.has(userId)) {
    clearTimeout(disconnectTimers.get(userId)!);
    disconnectTimers.delete(userId);
  }

  // RECONNECT
  const chatData = activeChats.get(userId);
  if (chatData) {
    const history = getHistory(chatData.chatId);
    socket.emit("chat_history", history);
  }

  // MESSAGE
  socket.on("send_message", ({ text }) => {
    const chatData = activeChats.get(userId);
    if (!chatData) return;

    addMessage(chatData.chatId, { text, senderId: userId });

    const partnerSocket = users.get(chatData.partnerId);
    if (partnerSocket) {
      io.to(partnerSocket).emit("receive_message", {
        text,
        senderId: userId,
      });
    }
  });

  // SEARCH
  socket.on("start_search", (data) => {
    const user: User = {
      userId,
      age: data.age,
      gender: data.gender,
      partnerAges: Array.isArray(data.partnerAges)
        ? data.partnerAges
        : [data.partnerAges],
      partnerGender: data.partnerGender,
    };

    removeFromQueue(userId);

    const matchIndex = queue.findIndex((u) => isMatch(u, user));

    if (matchIndex !== -1) {
      const matchedUser = queue.splice(matchIndex, 1)[0];

      const chatId = generateChatId();

      activeChats.set(userId, {
        partnerId: matchedUser.userId,
        chatId,
      });

      activeChats.set(matchedUser.userId, {
        partnerId: userId,
        chatId,
      });

      chatHistory.set(chatId, []);

      const partnerSocket = users.get(matchedUser.userId);

      io.to(socket.id).emit("match_found");
      if (partnerSocket) {
        io.to(partnerSocket).emit("match_found");
      }
    } else {
      queue.push(user);
    }
  });

  // LEAVE
  socket.on("leave_chat", () => {
    const chatData = activeChats.get(userId);
    if (!chatData) return;

    const partnerSocket = users.get(chatData.partnerId);

    if (partnerSocket) {
      io.to(partnerSocket).emit("partner_left");
    }

    clearChat(chatData.chatId);

    activeChats.delete(chatData.partnerId);
    activeChats.delete(userId);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const timer = setTimeout(() => {
      users.delete(userId);
      io.emit("online_count", users.size);

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

  socket.on("request_online_count", () => {
    socket.emit("online_count", users.size);
  });
}
