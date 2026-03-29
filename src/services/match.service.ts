import { queue } from "../store";
import { User } from "../types";

export function isMatch(a: User, b: User) {
  // Не матчим юзера с самим собой
  if (a.userId === b.userId) return false;

  // 1. Проверяем возраст (обоюдно)
  const ageMatch =
    a.partnerAges.includes(b.age) && b.partnerAges.includes(a.age);

  // 2. Проверяем пол (обоюдно, с учетом "any")
  const genderMatch =
    (a.partnerGender === "any" || a.partnerGender === b.gender) &&
    (b.partnerGender === "any" || b.partnerGender === a.gender);

  return ageMatch && genderMatch;
}

export function removeFromQueue(userId: string) {
  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].userId === userId) {
      queue.splice(i, 1);
    }
  }
}
