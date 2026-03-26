import { queue } from "../store";
import { User } from "../types";

export function isMatch(a: User, b: User) {
  if (a.userId === b.userId) return false;

  return (
    a.partnerAges.includes(b.age) &&
    a.partnerGender === b.gender &&
    b.partnerAges.includes(a.age) &&
    b.partnerGender === a.gender
  );
}

export function removeFromQueue(userId: string) {
  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].userId === userId) {
      queue.splice(i, 1);
    }
  }
}
