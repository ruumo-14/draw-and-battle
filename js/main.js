import { TYPES } from "./config.js";
import { loadGame, saveGame } from "./storage.js";
import { createMonster } from "./monsters.js";
import { initDrawing } from "./drawing.js";
import { initBattle } from "./battle.js";

const $ = id => document.getElementById(id);
const data = loadGame();
let encounter = null;
const save = () => saveGame(data);

function refreshSelects() {
  for (const id of ["drawSelect", "battleSelect"]) {
    const select = $(id);
    const previous = select.value;
    select.innerHTML = "";
    data.monsters.forEach((monster, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = monster.name + "（" + monster.rarity + "）";
      select.append(option);
    });
    if (data.monsters.length) select.value = Math.min(Number(previous) || 0, data.monsters.length - 1);
  }
}
function renderBook() {
  $("collection").innerHTML = data.monsters.length
    ? data.monsters.map(monster => '<article class="monster"><h3>' + monster.name + '</h3><span class="tag">' + monster.type + '</span><span class="tag">' + monster.rarity + '</span><p>HP ' + monster.hp + ' / ATK ' + monster.atk + ' / DEF ' + monster.def + '　<span class="muted">描画ボーナス +' + (monster.bonus || 0) + '</span></p>' +
      (monster.art ? '<img alt="自分で描いたモンスターの絵" src="' + monster.art + '" style="width:110px;height:110px;image-rendering:pixelated;object-fit:contain;background:#080e1d;border-radius:8px">' : '<span class="muted">イラスト未登録</span>') + '</article>').join("")
    : '<p class="muted">まだ仲間がいないよ。探索して捕獲しよう！</p>';
}
function refresh() {
  $("gold").textContent = data.gold;
  $("count").textContent = data.monsters.length;
  $("dex").textContent = data.seen.length;
  refreshSelects();
  renderBook();
}
function showFound() {
  if (!encounter) return;
  $("found").classList.remove("hidden");
  $("found").innerHTML = '<h3>' + encounter.name + '</h3><span class="tag">' + encounter.type + '</span><span class="tag">' + encounter.rarity + '</span><p>HP ' + encounter.hp + ' / ATK ' + encounter.atk + ' / DEF ' + encounter.def + '</p><button class="btn primary" id="catch">捕獲する</button>';
  $("catch").addEventListener("click", () => {
    data.monsters.push(encounter);
    if (!data.seen.includes(encounter.name)) data.seen.push(encounter.name);
    encounter = null;
    save();
    $("found").classList.add("hidden");
    refresh();
    alert("仲間になった！ お絵かきタブでイラストを描こう。");
  });
}
$("search").addEventListener("click", () => {
  if (data.gold < 10) { alert("GOLDが足りないよ。バトルでGOLDを集めよう。"); return; }
  data.gold -= 10;
  encounter = createMonster();
  save(); refresh(); showFound();
});
document.querySelectorAll("[data-tab]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach(tab => tab.classList.toggle("active", tab === button));
    ["explore", "draw", "book", "battle"].forEach(id => $(id).classList.toggle("hidden", id !== button.dataset.tab));
  });
});
initDrawing({ $, data, save, refresh, types: TYPES });
initBattle({ $, data, save, refresh });
refresh();
