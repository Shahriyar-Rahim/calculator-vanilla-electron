let currentImnput = "0";
let previousInput = "";
let operator = null;
let resultJustShown = false;

const currentOperandEl = document.getElementById("currentOperand");
const prevOperandEl = document.getElementById("prevOperand");

function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? "Error" : a / b;
    case "^": {
      const result = Math.pow(a, b);
      return isFinite(result) ? result : "Error";
    }
    default:
      return;
  }
}

// Scientific functions
function applyUnary(action) {
  if (currentImnput === "Error") return;
  const value = parseFloat(currentImnput);
  let result;

  switch (action) {
    case "sqrt":
      result = value < 0 ? "Error" : Math.sqrt(value);
      break;
    case "square":
      result = value * value;
      break;
    case "log":
      result = value <= 0 ? "Error" : Math.log10(value);
      break;
    case "sin":
      result = safeTrig("sin", value);
      break;
    case "cos":
      result = safeTrig("cos", value);
      break;
    case "tan":
      result = safeTrig("tan", value);
      break;
    default:
      return;
  }

  if (result === "Error") {
    setError();
    return;
  }

  currentImnput = result.toString();
  resultJustShown = true;
  updateDisplay();
}

function insertPi() {
  currentImnput = Math.PI.toString();
  resultJustShown = true;
  updateDisplay();
}

let angleMode = "DEG";
const angleModeEl = document.getElementById("angleMode");

function toRadians(value) {
  return angleMode === "DEG" ? (value * Math.PI) / 180 : value;
}

function cleanFloat(num) {
  return Math.abs(num) < 1e-10 ? 0 : Math.round(num * 1e12) / 1e12;
}

function safeTrig(fn, value) {
  const rad = toRadians(value);
  if (fn === "tan" && Math.abs(Math.cos(rad)) < 1e-10) return "Error";
  const result =
    fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : Math.tan(rad);
  return cleanFloat(result);
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  updateDisplay();
}

function updateDisplay() {
  angleModeEl.textContent = angleMode;
  currentOperandEl.textContent = currentImnput;
  prevOperandEl.textContent =
    previousInput && operator ? `${previousInput}${operator}` : ``;
}

function setError() {
  currentImnput = "Error";
  previousInput = "";
  operator = null;
  resultJustShown = true;
  updateDisplay();
}

function inputNumber(num) {
  if (currentImnput === "Error" || resultJustShown) {
    currentImnput = num === "." ? "0" : "";
    resultJustShown = false;
  }
  if (num === "." && currentImnput.includes(".")) return;
  if (currentImnput === "0" && num !== ".") {
    currentImnput = num;
  } else {
    currentImnput = currentImnput === "" ? num : currentImnput + num;
  }
  updateDisplay();
}

function choseOperator(op) {
  if (currentImnput === "Error") return;
  if (previousInput !== "" && operator && !resultJustShown) {
    const calcResult = calculate(previousInput, operator, currentImnput);
    if (calcResult === "Error") {
      setError();
      return;
    }
    previousInput = calcResult.toString();
  } else {
    previousInput = currentImnput;
  }

  operator = op;
  currentImnput = "0";
  resultJustShown = false;
  updateDisplay();
}


function loadHistory() {
  const raw = localStorage.getItem('calc-history');
  return raw ? JSON.parse(raw) : [];
}

function saveHistory(history) {
  localStorage.setItem('calc-history', JSON.stringify(history))
}

function addToHistory(expression, result) {
  const history = loadHistory();
  history.unshift({ expression, result });
  if(history.length > 50) history.pop();
  saveHistory(history)
}

function equals() {
  if (operator === null || currentImnput === "Error") return;
  const result = calculate(previousInput, operator, currentImnput);
  const expression = `${previousInput} ${operator} ${currentImnput}`
  if (result === "Error") {
    setError();
    return;
  }

  addToHistory(expression, result.toString());
  currentImnput = result.toString();
  previousInput = "";
  operator = null;
  resultJustShown = true;
  updateDisplay();
}

function clearAll() {
  currentImnput = "0";
  previousInput = "";
  operator = null;
  resultJustShown = false;
  updateDisplay();
}

// Button Listeners
document.querySelectorAll(".btn[data-number]").forEach((btn) => {
  btn.addEventListener("click", () => inputNumber(btn.dataset.number));
});

const actionMap = {
  clear: clearAll, 
  equals,
  add: () => choseOperator("+"),
  subtract: () => choseOperator("-"),
  multiply: () => choseOperator("*"),
  divide: () => choseOperator("/"),
  sqrt: () => applyUnary("sqrt"),
  square: () => applyUnary("square"),
  log: () => applyUnary("log"),
  pi: insertPi,
  power: () => choseOperator("^"),
  sin: () => applyUnary("sin"),
  cos: () => applyUnary("cos"),
  tan: () => applyUnary("tan"),
  "deg-rad": toggleAngleMode,
};

document.querySelectorAll(".btn[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = actionMap[btn.dataset.action];
    if (action) action();
  });
});

updateDisplay();
