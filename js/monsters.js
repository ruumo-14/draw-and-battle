import { TYPES, RARITIES, MONSTER_NAMES } from "./config.js";
function weightedRarity() {
  let roll = Math.random() * 100;
  for (const rarity of RARITIES) {
    roll -= rarity.w;
    if (roll <= 0) return rarity;
  }
  return RARITIES[0];
}
export function createMonster() {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const rarity = weightedRarity();
  const name = MONSTER_NAMES[Math.floor(Math.random() * MONSTER_NAMES.length)];
  return {
    id: Date.now() + Math.random(),
    name: type.n + "の" + name,
    type: type.n,
    color: type.c,
    rarity: rarity.n,
    mult: rarity.m,
    hp: Math.round(40 * rarity.m),
    atk: Math.round(10 * rarity.m),
    def: Math.round(5 * rarity.m),
    bonus: 0,
    art: null
  };
}
