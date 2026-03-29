import { queue } from "../store";
import { QueueUser } from "../types/search";

// 1. жесткая проверка (возраст и пол)
export function isMatch(a: QueueUser, b: QueueUser): boolean {
  // Не матчим юзера с самим собой
  if (a.userId === b.userId) return false;

  // Проверяем возраст (обоюдно)
  const ageMatch =
    a.partnerAges.includes(b.age) && b.partnerAges.includes(a.age);

  // Проверяем пол (обоюдно, с учетом "any")
  const genderMatch =
    (a.partnerGender === "any" || a.partnerGender === b.gender) &&
    (b.partnerGender === "any" || b.partnerGender === a.gender);

  return ageMatch && genderMatch;
}

// 2. ФУНКЦИЯ: Умный поиск (Считаем процент совместимости)
export function calculateMatchScore(
  user1: QueueUser,
  user2: QueueUser,
): number {
  // Если по полу или возрасту не подходят — сразу 0 баллов
  if (!isMatch(user1, user2)) return 0;

  // Если у кого-то нет данных характера (например, старая версия фронта), даем 50%
  if (!user1.traits || !user2.traits) return 50;

  let score = 0;

  // === ИНТЕРЕСЫ (Вес: 40 баллов) ===
  const interests1 = user1.traits.interests || [];
  const interests2 = user2.traits.interests || [];

  if (interests1.length > 0 && interests2.length > 0) {
    const sharedInterests = interests1.filter((i) =>
      interests2.includes(i),
    ).length;
    const minInterestsCount = Math.min(interests1.length, interests2.length);
    score += (sharedInterests / minInterestsCount) * 40;
  }

  // === ХАРАКТЕР (Вес: 60 баллов) ===
  const t1 = user1.traits;
  const t2 = user2.traits;

  // Энергия (Ищем сходство)
  const energyDiff = Math.abs(t1.energy - t2.energy);
  score += 20 * (1 - energyDiff / 9);

  // Логика (Ищем сходство)
  const logicDiff = Math.abs(t1.logic - t2.logic);
  score += 20 * (1 - logicDiff / 9);

  // Разговорчивость (Ищем взаимодополняемость: 10 + 1 = идеальная пара)
  const talkSum = t1.talkativeness + t2.talkativeness;
  const talkDiffFromIdeal = Math.abs(11 - talkSum);
  score += 20 * (1 - talkDiffFromIdeal / 9);

  return Math.round(score);
}

// 3. Оставляем как было, только типы поправим
export function removeFromQueue(userId: string) {
  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].userId === userId) {
      queue.splice(i, 1);
    }
  }
}
