import { Server } from "socket.io";
import { queue, activeChats, chatHistory, users } from "../store";
import { calculateMatchScore, isMatch } from "./match.service";
import { generateChatId } from "./chat.service";

let isLoopRunning = false;

export function startMatchmakingLoop(io: Server) {
  if (isLoopRunning) return;
  isLoopRunning = true;

  console.log("Фоновый цикл матчмейкинга запущен");

  // Запускаем цикл каждую 1 секунду (вместо 2)
  setInterval(() => {
    if (queue.length < 2) return;

    for (let i = queue.length - 1; i >= 0; i--) {
      const userA = queue[i];
      if (!userA) continue;

      const timeWaiting = Date.now() - userA.joinedAt;

      // Ускоряем деградацию требований
      let requiredScore = 80; // 0 - 2 секунды: ищем > 80%
      if (timeWaiting > 4000) {
        requiredScore = 0; // После 4 секунд: берем любого
      } else if (timeWaiting > 2000) {
        requiredScore = 50; // От 2 до 4 секунд: соглашаемся на > 50%
      }

      let bestMatchIndex = -1;
      let highestScore = -1;

      for (let j = i - 1; j >= 0; j--) {
        const userB = queue[j];
        if (!userB) continue;

        if (!isMatch(userA, userB)) continue;

        const score = calculateMatchScore(userA, userB);

        if (score >= requiredScore && score > highestScore) {
          highestScore = score;
          bestMatchIndex = j;
        }
      }

      if (bestMatchIndex !== -1) {
        const userB = queue[bestMatchIndex];

        queue.splice(i, 1);
        queue.splice(bestMatchIndex, 1);
        i--;

        const chatId = generateChatId();
        activeChats.set(userA.userId, { partnerId: userB.userId, chatId });
        activeChats.set(userB.userId, { partnerId: userA.userId, chatId });
        chatHistory.set(chatId, []);

        const socketA = users.get(userA.userId);
        const socketB = users.get(userB.userId);

        if (socketA) io.to(socketA).emit("match_found");
        if (socketB) io.to(socketB).emit("match_found");

        console.log(
          `Пользователи соединены (Счет: ${highestScore}%, Ожидание: ${timeWaiting}ms)`,
        );
      }
    }
  }, 1000);
}
