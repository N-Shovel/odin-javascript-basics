const MAX_DIGITS = 12;
const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };

const currentDisplay = document.querySelector("#current");
const historyDisplay = document.querySelector("#history");
const buttons = document.querySelector(".buttons");
const operatorButtons = document.querySelectorAll("[data-operator]");

let firstNumber = null;
let operator = null;
let currentInput = "0";
// True right after an operator or equals, so the next digit starts a new number.
let shouldResetInput = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return b === 0 ? null : a / b;
}

function operate(op, a, b) {
  switch (op) {
    case "+": return add(a, b);
    case "-": return subtract(a, b);
    case "*": return multiply(a, b);
    case "/": return divide(a, b);
    default: return null;
  }
}

// Rounds away floating-point noise (0.1 + 0.2) and keeps long results on screen.
function formatResult(value) {
  const rounded = Number(value.toPrecision(MAX_DIGITS));
  const text = String(rounded);
  return text.replace("-", "").replace(".", "").length > MAX_DIGITS
    ? rounded.toExponential(6)
    : text;
}

function updateDisplay() {
  currentDisplay.textContent = currentInput;
  historyDisplay.textContent = operator ? `${firstNumber} ${SYMBOLS[operator]}` : "";
  operatorButtons.forEach((button) => {
    button.classList.toggle("active", shouldResetInput && button.dataset.operator === operator);
  });
}

function clearAll() {
  firstNumber = null;
  operator = null;
  currentInput = "0";
  shouldResetInput = false;
}

function showError() {
  clearAll();
  currentInput = "Nice try 🙃";
  shouldResetInput = true;
}

function inputDigit(digit) {
  if (shouldResetInput) {
    currentInput = "0";
    shouldResetInput = false;
  }
  if (currentInput.replace("-", "").replace(".", "").length >= MAX_DIGITS) return;
  currentInput = currentInput === "0" ? digit : currentInput + digit;
}

function inputDecimal() {
  if (shouldResetInput) {
    currentInput = "0";
    shouldResetInput = false;
  }
  if (!currentInput.includes(".")) currentInput += ".";
}

function backspace() {
  if (shouldResetInput) return;
  currentInput = currentInput.slice(0, -1);
  if (currentInput === "" || currentInput === "-") currentInput = "0";
}

function percent() {
  if (isNaN(currentInput)) return;
  currentInput = formatResult(Number(currentInput) / 100);
}

// Returns false when the calculation failed (divide by zero).
function evaluate() {
  if (operator === null || shouldResetInput) return true;

  const result = operate(operator, Number(firstNumber), Number(currentInput));
  if (result === null) {
    showError();
    return false;
  }

  currentInput = formatResult(result);
  firstNumber = null;
  operator = null;
  shouldResetInput = true;
  return true;
}

function chooseOperator(nextOperator) {
  if (isNaN(currentInput)) return;

  // Pressing operators back to back just swaps the pending one.
  if (operator !== null && shouldResetInput) {
    operator = nextOperator;
    return;
  }

  if (!evaluate()) return;
  firstNumber = currentInput;
  operator = nextOperator;
  shouldResetInput = true;
}

function handleAction(action) {
  switch (action) {
    case "clear": clearAll(); break;
    case "backspace": backspace(); break;
    case "percent": percent(); break;
    case "decimal": inputDecimal(); break;
    case "equals": evaluate(); break;
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { digit, operator: op, action } = button.dataset;
  if (digit !== undefined) inputDigit(digit);
  else if (op) chooseOperator(op);
  else if (action) handleAction(action);

  updateDisplay();
});

document.addEventListener("keydown", (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) inputDigit(key);
  else if (key in SYMBOLS) chooseOperator(key);
  else if (key === "." || key === ",") handleAction("decimal");
  else if (key === "Enter" || key === "=") handleAction("equals");
  else if (key === "Backspace") handleAction("backspace");
  else if (key === "Escape" || key.toLowerCase() === "c") handleAction("clear");
  else if (key === "%") handleAction("percent");
  else return;

  event.preventDefault();
  updateDisplay();
});

updateDisplay();
