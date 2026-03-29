import { Message, User } from "../types";

export let queue: User[] = [];

export function setQueue(newQueue: User[]) {
  queue = newQueue;
}

export const users = new Map<string, string>();

export const activeChats = new Map<
  string,
  { partnerId: string; chatId: string }
>();

export const disconnectTimers = new Map<string, NodeJS.Timeout>();

export const chatHistory = new Map<string, Message[]>();
