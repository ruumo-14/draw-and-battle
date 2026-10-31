import { SAVE_KEY } from "./config.js";
const EMPTY_SAVE = { gold: 50, monsters: [], seen: [] };
export function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (!saved || typeof saved !== "object") return structuredClone(EMPTY_SAVE);
    return {
      gold: Number.isFinite(saved.gold) ? saved.gold : 50,
      monsters: Array.isArray(saved.monsters) ? saved.monsters : [],
      seen: Array.isArray(saved.seen) ? saved.seen : []
    };
  } catch {
    return structuredClone(EMPTY_SAVE);
  }
}
export function saveGame(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}
