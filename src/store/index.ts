import { Message } from "../types";
import { QueueUser } from "../types/search";

// 1. Очередь использует тип QueueUser (с чертами характера)
export let queue: QueueUser[] = [];

// функция добавления (с защитой от дублей)
export const addUserToQueue = (user: QueueUser) => {
  const isAlreadyInQueue = queue.some((u) => u.socketId === user.socketId);
  if (!isAlreadyInQueue) {
    queue.push(user);
    console.log(
      `[Queue] Юзер ${user.socketId} добавлен в поиск. Всего в очереди: ${queue.length}`,
    );
  }
};

// функция удаления
export const removeUserFromQueue = (socketId: string) => {
  queue = queue.filter((u) => u.socketId !== socketId);
};

// Функция получения очереди
export const getQueue = (): QueueUser[] => {
  return queue;
};

export function setQueue(newQueue: QueueUser[]) {
  queue = newQueue;
}

export const users = new Map<string, string>();

export const activeChats = new Map<
  string,
  { partnerId: string; chatId: string }
>();

export const disconnectTimers = new Map<string, NodeJS.Timeout>();

export const chatHistory = new Map<string, Message[]>();
