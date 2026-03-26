import { chatHistory } from "../store";
import { Message } from "../types";

export const generateChatId = () => {
  return Date.now().toString() + "_" + Math.random().toString(36);
};

export function addMessage(chatId: string, message: Message) {
  if (!chatHistory.has(chatId)) {
    chatHistory.set(chatId, []);
  }

  chatHistory.get(chatId)!.push(message);
}

export function getHistory(chatId: string) {
  return chatHistory.get(chatId) || [];
}

export function clearChat(chatId: string) {
  chatHistory.delete(chatId);
}