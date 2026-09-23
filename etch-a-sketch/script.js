const DEFAULT_SIZE = 16;
const MAX_SIZE = 100;
const MODES = ["black", "rainbow"];

const container = document.querySelector("#container");
const resizeButton = document.querySelector("#resize");
const modeButton = document.querySelector("#mode");
const clearButton = document.querySelector("#clear");
const gridInfo = document.querySelector("#grid-info");

let currentSize = DEFAULT_SIZE;
let currentMode = "black";

function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Each pass over a square darkens it by 10%, reaching full color after 10 passes.
function paintSquare(square) {
  const opacity = Math.min(Number(square.dataset.opacity || 0) + 0.1, 1);
  square.dataset.opacity = opacity;
  square.style.opacity = opacity;

  if (!square.style.backgroundColor || currentMode === "rainbow") {
    square.style.backgroundColor = currentMode === "rainbow" ? randomColor() : "black";
  }
}

function createGrid(size) {
  container.innerHTML = "";
  const squareSize = `calc(100% / ${size})`;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = squareSize;
    square.style.height = squareSize;
    square.addEventListener("mouseenter", () => paintSquare(square));
    container.appendChild(square);
  }

  gridInfo.textContent = `${size} × ${size}`;
}

function promptForSize() {
  const input = prompt(`Enter the number of squares per side (1-${MAX_SIZE}):`, currentSize);
  if (input === null) return;

  const size = Number(input);
  if (!Number.isInteger(size) || size < 1 || size > MAX_SIZE) {
    alert(`Please enter a whole number from 1 to ${MAX_SIZE}.`);
    return;
  }

  currentSize = size;
  createGrid(currentSize);
}

function toggleMode() {
  const nextIndex = (MODES.indexOf(currentMode) + 1) % MODES.length;
  currentMode = MODES[nextIndex];
  modeButton.textContent = `Mode: ${currentMode === "black" ? "Black" : "Rainbow"}`;
}

resizeButton.addEventListener("click", promptForSize);
modeButton.addEventListener("click", toggleMode);
clearButton.addEventListener("click", () => createGrid(currentSize));

createGrid(currentSize);
