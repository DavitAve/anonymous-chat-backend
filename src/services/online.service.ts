import { Server } from "socket.io";
import { users } from "../store";

const SHOW_REAL_ONLINE = false;

const MIN_FAKE = 75;
const MAX_FAKE = 110;

let displayedCount =
  MIN_FAKE + Math.floor(Math.random() * (MAX_FAKE - MIN_FAKE + 1));
let targetCount = displayedCount;

export function startOnlineCounter(io: Server) {
  setInterval(() => {
    if (SHOW_REAL_ONLINE) {
      io.emit("online_count", users.size);
      return;
    }

    const realCount = users.size;

    if (realCount >= MIN_FAKE) {
      targetCount = realCount;
    } else {
      const shift = Math.floor(Math.random() * 5) - 2;
      targetCount = Math.max(MIN_FAKE, Math.min(MAX_FAKE, targetCount + shift));
    }

    if (displayedCount !== targetCount) {
      const diff = targetCount - displayedCount;
      let step = 0;
      if (Math.abs(diff) > 10) {
        step = Math.sign(diff) * (Math.floor(Math.random() * 3) + 2);
      } else {
        step = Math.sign(diff) * (Math.random() > 0.3 ? 1 : 0);
      }
      displayedCount += step;
    } else if (realCount < MIN_FAKE && Math.random() > 0.8) {
      displayedCount += Math.random() > 0.5 ? 1 : -1;
    }

    io.emit("online_count", displayedCount);
  }, 2500);
}

export function getCurrentOnlineCount(): number {
  if (SHOW_REAL_ONLINE) return users.size;
  return displayedCount;
}
