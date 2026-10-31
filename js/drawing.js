const GRID = 32;
const CELL = 10;
const BACKGROUND = "#080e1d";
export function initDrawing({ $, data, save, refresh, types }) {
  const canvas = $("art");
  const ctx = canvas.getContext("2d");
  let pixels = Array.from({ length: GRID }, () => Array(GRID).fill(null));
  let history = [];
  let drawing = false;
  let color = "#ff654f";
  let tool = "pencil";

  function snapshot() {
    history.push(pixels.map(row => row.slice()));
    if (history.length > 40) history.shift();
  }
  function redraw() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        if (!pixels[y][x]) continue;
        ctx.fillStyle = pixels[y][x];
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    ctx.strokeStyle = "rgba(170,190,230,.20)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL + .5, 0); ctx.lineTo(i * CELL + .5, GRID * CELL); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL + .5); ctx.lineTo(GRID * CELL, i * CELL + .5); ctx.stroke();
    }
  }
  function setPixel(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(GRID - 1, Math.floor((event.clientX - rect.left) * GRID / rect.width)));
    const y = Math.max(0, Math.min(GRID - 1, Math.floor((event.clientY - rect.top) * GRID / rect.height)));
    pixels[y][x] = tool === "eraser" ? null : color;
    redraw();
  }
  function chooseTool(next) {
    tool = next;
    $("pencil").classList.toggle("primary", tool === "pencil");
    $("eraser").classList.toggle("primary", tool === "eraser");
  }

  [...types, { n: "白", c: "#ffffff" }, { n: "黒", c: "#111827" },
    { n: "桃", c: "#ff8fc7" }, { n: "橙", c: "#ffad5a" }].forEach(item => {
    const button = document.createElement("button");
    button.className = "swatch" + (item.c === color ? " selected" : "");
    button.style.background = item.c;
    button.title = item.n;
    button.setAttribute("aria-label", item.n);
    button.addEventListener("click", () => {
      color = item.c;
      document.querySelectorAll(".swatch").forEach(swatch => swatch.classList.remove("selected"));
      button.classList.add("selected");
      chooseTool("pencil");
    });
    $("palette").append(button);
  });

  $("pencil").addEventListener("click", () => chooseTool("pencil"));
  $("eraser").addEventListener("click", () => chooseTool("eraser"));
  canvas.addEventListener("pointerdown", event => {
    if (!data.monsters.length) { alert("先にモンスターを捕獲してね"); return; }
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    snapshot();
    setPixel(event);
  });
  canvas.addEventListener("pointermove", event => { if (drawing) setPixel(event); });
  canvas.addEventListener("pointerup", () => { drawing = false; });
  canvas.addEventListener("pointercancel", () => { drawing = false; });

  $("undo").addEventListener("click", () => {
    if (history.length) pixels = history.pop();
    redraw();
  });
  $("clear").addEventListener("click", () => {
    snapshot();
    pixels = Array.from({ length: GRID }, () => Array(GRID).fill(null));
    redraw();
    $("artResult").textContent = "キャンバスを消したよ。";
  });
  $("saveArt").addEventListener("click", () => {
    const monster = data.monsters[Number($("drawSelect").value)];
    if (!monster) { alert("先にモンスターを捕獲してね"); return; }
    const usedPixels = pixels.flat().filter(Boolean);
    if (!usedPixels.length) { alert("まずドットを描いてね"); return; }
    let matchingColors = 0;
    for (const row of pixels) for (const pixel of row) {
      if (pixel && pixel.toLowerCase() === monster.color.toLowerCase()) matchingColors++;
    }
    const score = Math.min(5, Math.max(1, Math.floor(usedPixels.length / 35) + (matchingColors ? 1 : 0)));
    const artwork = document.createElement("canvas");
    artwork.width = GRID; artwork.height = GRID;
    const artContext = artwork.getContext("2d");
    for (let y = 0; y < GRID; y++) for (let x = 0; x < GRID; x++) {
      if (pixels[y][x]) { artContext.fillStyle = pixels[y][x]; artContext.fillRect(x, y, 1, 1); }
    }
    monster.bonus = (monster.bonus || 0) + score;
    monster.hp += score * 2; monster.atk += score; monster.def += score;
    monster.art = artwork.toDataURL("image/png");
    save(); refresh();
    $("artResult").textContent = "ドット絵を保存！ 評価：" + score + "ポイント。HP・ATK・DEFが少し上がったよ。";
  });
  redraw();
}
