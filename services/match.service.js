"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatch = isMatch;
exports.removeFromQueue = removeFromQueue;
const store_1 = require("../store");
function isMatch(a, b) {
    if (a.userId === b.userId)
        return false;
    return (a.partnerAges.includes(b.age) &&
        a.partnerGender === b.gender &&
        b.partnerAges.includes(a.age) &&
        b.partnerGender === a.gender);
}
function removeFromQueue(userId) {
    for (let i = store_1.queue.length - 1; i >= 0; i--) {
        if (store_1.queue[i].userId === userId) {
            store_1.queue.splice(i, 1);
        }
    }
}
