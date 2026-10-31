export function initBattle({ $, data, save, refresh }) {
  $("startBattle").addEventListener("click", () => {
    const monster = data.monsters[Number($("battleSelect").value)];
    if (!monster) { alert("先にモンスターを捕獲してね"); return; }
    const enemy = { hp: 35 + Math.floor(Math.random() * 35), atk: 8 + Math.floor(Math.random() * 8) };
    let enemyHp = enemy.hp;
    let playerHp = monster.hp;
    const area = $("battleArea");
    area.classList.remove("hidden");
    area.innerHTML = '<h3>' + monster.name + ' VS 野生のライバル</h3><p id="battleText">バトル開始！</p><p>相手HP：<b id="ehp"></b> ／ ' + monster.name + ' HP：<b id="mhp"></b></p><button class="btn primary" id="attack">こうげき</button>';
    const updateHp = () => {
      $("ehp").textContent = Math.max(0, Math.ceil(enemyHp));
      $("mhp").textContent = Math.max(0, Math.ceil(playerHp));
    };
    updateHp();
    $("attack").addEventListener("click", () => {
      if (enemyHp <= 0 || playerHp <= 0) return;
      enemyHp -= Math.max(1, monster.atk - enemy.atk / 3);
      if (enemyHp > 0) playerHp -= Math.max(1, enemy.atk - monster.def / 3);
      updateHp();
      if (enemyHp <= 0) {
        const reward = 15 + Math.floor(Math.random() * 16);
        data.gold += reward;
        $("battleText").textContent = "勝利！ " + reward + " GOLDを獲得！";
        $("attack").disabled = true;
        save(); refresh();
      } else if (playerHp <= 0) {
        $("battleText").textContent = "今回は負けてしまった…。また挑戦しよう。";
        $("attack").disabled = true;
      }
    });
  });
}
