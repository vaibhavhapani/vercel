"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const MAX_LEN = 5;
function generate() {
    let ans = "";
    const dict = "1234567890qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < MAX_LEN; i++) {
        ans += dict[Math.floor(Math.random() * dict.length)];
    }
    return ans;
}
exports.generate = generate;
