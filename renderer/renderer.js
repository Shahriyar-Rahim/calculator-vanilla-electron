let currentInput = "0";
let previousInput = "";
let operator = null;
let resultJustShown = false;
let angleMode = "DEG";
let isMuted = false;
let isShiftMode = false;
let audioCtx = null;

const currentOperandEl = document.getElementById("currentOperand");
const prevOperandEl = document.getElementById("prevOperand");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");
const angleModeEl = document.getElementById("angleMode");
const themeToggleBtn = document.getElementById("theme-toggle");
const muteToggleBtn = document.getElementById("muteToggle");
const btnShift = document.getElementById("btnShift");

const btnSin = document.getElementById("btnSin");
const btnCos = document.getElementById("btnCos");
const btnTan = document.getElementById("btnTan");
const btnSquare = document.getElementById("btnSquare");
const btnSqrt = document.getElementById("btnSqrt");
const btnPower = document.getElementById("btnPower");
const btnLog = document.getElementById("btnLog");

function toggleShiftMode() {
  isShiftMode = !isShiftMode;
  if (btnShift) btnShift.classList.toggle("active-mode", isShiftMode);

  if (isShiftMode) {
    if (btnSin) { btnSin.textContent = "sin⁻¹"; btnSin.dataset.action = "asin"; }
    if (btnCos) { btnCos.textContent = "cos⁻¹"; btnCos.dataset.action = "acos"; }
    if (btnTan) { btnTan.textContent = "tan⁻¹"; btnTan.dataset.action = "atan"; }
    if (btnSquare) { btnSquare.textContent = "|x|"; btnSquare.dataset.action = "abs"; }
    if (btnSqrt) { btnSqrt.textContent = "d/dx"; btnSqrt.dataset.action = "diff"; }
    if (btnPower) { btnPower.textContent = "∫dx"; btnPower.dataset.action = "integ"; }
    if (btnLog) { btnLog.textContent = "∑"; btnLog.dataset.action = "sum"; }
  } else {
    if (btnSin) { btnSin.textContent = "sin"; btnSin.dataset.action = "sin"; }
    if (btnCos) { btnCos.textContent = "cos"; btnCos.dataset.action = "cos"; }
    if (btnTan) { btnTan.textContent = "tan"; btnTan.dataset.action = "tan"; }
    if (btnSquare) { btnSquare.textContent = "x²"; btnSquare.dataset.action = "square"; }
    if (btnSqrt) { btnSqrt.textContent = "√x"; btnSqrt.dataset.action = "sqrt"; }
    if (btnPower) { btnPower.textContent = "x^y"; btnPower.dataset.action = "power"; }
    if (btnLog) { btnLog.textContent = "log"; btnLog.dataset.action = "log"; }
  }
  playSound("operator");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("calc-theme") || "dark";
  const isLight = savedTheme === "light";
  document.body.classList.toggle("light", isLight);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("calc-theme", isLight ? "light" : "dark");
  if (themeToggleBtn) {
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  }
}

function loadMuteState() {
  isMuted = localStorage.getItem("calc-muted") === "true";
  if (muteToggleBtn) {
    muteToggleBtn.textContent = isMuted ? "🔇" : "🔉";
  }
}

function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("calc-muted", isMuted.toString());
  if (muteToggleBtn) {
    muteToggleBtn.textContent = isMuted ? "🔇" : "🔉";
  }
}

function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    case "^": {
      const result = Math.pow(a, b);
      return isFinite(result) ? result : "Error";
    }
    default: return;
  }
}

function toRadians(value) {
  return angleMode === "DEG" ? (value * Math.PI) / 180 : value;
}

function fromRadians(rad) {
  return angleMode === "DEG" ? (rad * 180) / Math.PI : rad;
}

function cleanFloat(num) {
  if (typeof num !== "number" || !isFinite(num)) return num;
  if (Math.abs(num) > 0 && Math.abs(num) < 1e-10) return 0;
  return Math.round(num * 1e12) / 1e12;
}

function safeTrig(fn, value) {
  const rad = toRadians(value);
  if (fn === "tan" && Math.abs(Math.cos(rad)) < 1e-10) return "Error";
  const result = fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : Math.tan(rad);
  return cleanFloat(result);
}

function safeInverseTrig(fn, value) {
  if ((fn === "asin" || fn === "acos") && (value < -1 || value > 1)) return "Error";
  let result;
  if (fn === "asin") result = Math.asin(value);
  if (fn === "acos") result = Math.acos(value);
  if (fn === "atan") result = Math.atan(value);
  return cleanFloat(fromRadians(result));
}

function differentiate(x, h = 1e-6) {
  const fn = (v) => v * v + v;
  const derivative = (fn(x + h) - fn(x - h)) / (2 * h);
  return cleanFloat(derivative);
}

function integrate(upperBound, n = 1000) {
  const a = 0;
  const b = upperBound;
  if (a === b) return 0;
  const fn = (v) => v * v;
  if (n % 2 !== 0) n++;
  const h = (b - a) / n;
  let sum = fn(a) + fn(b);

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += (i % 2 === 0 ? 2 : 4) * fn(x);
  }
  return cleanFloat((h / 3) * sum);
}

function summation(end) {
  const limit = Math.floor(end);
  if (limit < 1) return "Error";
  let sum = 0;
  for (let i = 1; i <= limit; i++) {
    sum += i * i;
  }
  return sum;
}

function applyUnary(action) {
  if (currentInput === "Error") return;
  const value = parseFloat(currentInput);
  let result;

  switch (action) {
    case "sqrt": result = value < 0 ? "Error" : Math.sqrt(value); break;
    case "square": result = value * value; break;
    case "log": result = value <= 0 ? "Error" : Math.log10(value); break;
    case "sin": result = safeTrig("sin", value); break;
    case "cos": result = safeTrig("cos", value); break;
    case "tan": result = safeTrig("tan", value); break;
    case "asin": result = safeInverseTrig("asin", value); break;
    case "acos": result = safeInverseTrig("acos", value); break;
    case "atan": result = safeInverseTrig("atan", value); break;
    case "abs": result = Math.abs(value); break;
    case "diff": result = differentiate(value); break;
    case "integ": result = integrate(value); break;
    case "sum": result = summation(value); break;
    default: return;
  }

  if (result === "Error") {
    setError();
    return;
  }

  currentInput = result.toString();
  resultJustShown = true;
  updateDisplay();
  playSound("operator");
}

function insertPi() {
  currentInput = Math.PI.toString();
  resultJustShown = true;
  updateDisplay();
  playSound("number");
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  updateDisplay();
  playSound("operator");
}

function updateDisplay() {
  if (angleModeEl) angleModeEl.textContent = angleMode;
  if (currentOperandEl) currentOperandEl.textContent = currentInput;
  if (prevOperandEl) {
    prevOperandEl.textContent = previousInput && operator ? `${previousInput} ${operator}` : "";
  }
}

function setError() {
  currentInput = "Error";
  previousInput = "";
  operator = null;
  resultJustShown = true;
  updateDisplay();
  playSound("error");
}

function inputNumber(num) {
  if (currentInput === "Error" || resultJustShown) {
    currentInput = num === "." ? "0" : "";
    resultJustShown = false;
  }
  if (num === "." && currentInput.includes(".")) return;
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput = currentInput === "" ? num : currentInput + num;
  }
  updateDisplay();
  playSound("number");
}

function choseOperator(op) {
  if (currentInput === "Error") return;
  if (previousInput !== "" && operator && !resultJustShown) {
    const calcResult = calculate(previousInput, operator, currentInput);
    if (calcResult === "Error") {
      setError();
      return;
    }
    previousInput = calcResult.toString();
  } else {
    previousInput = currentInput;
  }

  operator = op;
  currentInput = "0";
  resultJustShown = false;
  updateDisplay();
  playSound("operator");
}

function equals() {
  if (operator === null || currentInput === "Error") return;
  const result = calculate(previousInput, operator, currentInput);
  const expression = `${previousInput} ${operator} ${currentInput}`;
  if (result === "Error") {
    setError();
    return;
  }

  addToHistory(expression, result.toString());
  currentInput = result.toString();
  previousInput = "";
  operator = null;
  resultJustShown = true;
  updateDisplay();
  playSound("result");
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  resultJustShown = false;
  updateDisplay();
  playSound("operator");
}

function deleteLastDigit() {
  if (currentInput === "Error" || resultJustShown) {
    currentInput = "0";
    resultJustShown = false;
    updateDisplay();
    playSound("operator");
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
    if (currentInput === "-") currentInput = "0";
  } else {
    currentInput = "0";
  }

  updateDisplay();
  playSound("operator");
}

async function copyResult() {
  try {
    if (window.electronApi?.copyToClipboard) {
      await window.electronApi.copyToClipboard(currentInput);
    } else {
      await navigator.clipboard.writeText(currentInput);
    }
    flashCopyFeedback();
  } catch (err) {
    console.error("Copy failed:", err);
  }
}

function sanitizeNumeric(text) {
  if (!text || typeof text !== "string") return null;
  let cleaned = text.replace(/[, \t\u00A0\s]/g, "").trim();
  if (cleaned.startsWith(".")) cleaned = "0" + cleaned;
  if (cleaned.startsWith("-.")) cleaned = "-0" + cleaned.slice(1);
  const isValid = /^-?\d*\.?\d+(?:e[+-]?\d+)?$/i.test(cleaned) || /^-?\d+\.$/.test(cleaned);
  return isValid ? cleaned : null;
}

async function pasteValue() {
  try {
    let text = "";
    if (window.electronApi?.readFromClipboard) {
      text = await window.electronApi.readFromClipboard();
    } else {
      text = await navigator.clipboard.readText();
    }
    const sanitized = sanitizeNumeric(text);
    if (sanitized === null) {
      flashWarningFeedback();
      return;
    }

    currentInput = sanitized;
    resultJustShown = false;
    updateDisplay();
  } catch (err) {
    console.error("Paste failed:", err);
    flashWarningFeedback();
  }
}

function flashCopyFeedback() {
  if (!currentOperandEl) return;
  const original = currentOperandEl.style.color;
  currentOperandEl.style.color = "#4caf7d";
  setTimeout(() => { currentOperandEl.style.color = original; }, 200);
}

function flashWarningFeedback() {
  if (!currentOperandEl) return;
  const originalColor = currentOperandEl.style.color;
  const originalText = currentInput;

  currentOperandEl.style.color = "#ff5555";
  currentOperandEl.textContent = "Invalid";

  setTimeout(() => {
    currentOperandEl.style.color = originalColor;
    currentOperandEl.textContent = originalText;
  }, 600);
}

function loadHistory() {
  const raw = localStorage.getItem("calc-history");
  return raw ? JSON.parse(raw) : [];
}

function saveHistory(history) {
  localStorage.setItem("calc-history", JSON.stringify(history));
}

function addToHistory(expression, result) {
  const history = loadHistory();
  history.unshift({ expression, result });
  if (history.length > 50) history.pop();
  saveHistory(history);
  renderHistory();
}

function renderHistory() {
  const history = loadHistory();
  if (!historyList) return;
  historyList.innerHTML = "";

  if (clearHistoryBtn) {
    clearHistoryBtn.style.display = history.length === 0 ? "none" : "block";
  }

  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "history-item";

    const exprDiv = document.createElement("div");
    exprDiv.className = "expr";
    exprDiv.textContent = item.expression;

    const resDiv = document.createElement("div");
    resDiv.className = "result";
    resDiv.textContent = item.result;

    div.appendChild(exprDiv);
    div.appendChild(resDiv);

    div.addEventListener("click", () => {
      currentInput = item.result;
      resultJustShown = true;
      updateDisplay();
      historyPanel?.classList.remove("open");
    });
    historyList.appendChild(div);
  });
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playSound(kind) {
  if (isMuted) return;
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  const frequencies = { number: 440, operator: 550, result: 600, error: 220 };
  oscillator.frequency.value = frequencies[kind] || 440;
  oscillator.type = "sine";

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.12);
}

const actionMap = {
  clear: clearAll,
  equals,
  backspace: deleteLastDigit,
  "toggle-shift": toggleShiftMode,
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
  asin: () => applyUnary("asin"),
  acos: () => applyUnary("acos"),
  atan: () => applyUnary("atan"),
  abs: () => applyUnary("abs"),
  diff: () => applyUnary("diff"),
  integ: () => applyUnary("integ"),
  sum: () => applyUnary("sum"),
  "deg-rad": toggleAngleMode,
  copy: copyResult,
  paste: pasteValue,
};

const keyToButtonSelector = {
  "+": '[data-action="add"]',
  "-": '[data-action="subtract"]',
  "*": '[data-action="multiply"]',
  "/": '[data-action="divide"]',
  "^": '[data-action="power"]',
  Enter: '[data-action="equals"]',
  "=": '[data-action="equals"]',
  Escape: '[data-action="clear"]',
  s: '[data-action="sin"]',
  c: '[data-action="cos"]',
  t: '[data-action="tan"]',
  r: '[data-action="sqrt"]',
  q: '[data-action="square"]',
  p: '[data-action="pi"]',
  l: '[data-action="log"]',
  d: '[data-action="deg-rad"]',
  Backspace: '[data-action="backspace"]',
};

function pressVisual(selector) {
  const el = document.querySelector(selector);
  if (el) el.classList.add("pressed");
}

function releaseVisual(selector) {
  const el = document.querySelector(selector);
  if (el) el.classList.remove("pressed");
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    const key = e.key.toLowerCase();
    if (key === "c") {
      e.preventDefault();
      copyResult();
      return;
    }
    if (key === "v") {
      e.preventDefault();
      pasteValue();
      return;
    }
    return;
  }

  if (e.key === "Tab") e.preventDefault();

  if (e.key === "Backspace") {
    deleteLastDigit();
    const selector = keyToButtonSelector["Backspace"];
    if (selector) pressVisual(selector);
    return;
  }

  if (/^[0-9]$/.test(e.key) || e.key === ".") {
    const selector = `.btn[data-number="${e.key}"]`;
    inputNumber(e.key);
    if (selector) pressVisual(selector);
    return;
  }

  if (e.key === "h") {
    historyPanel?.classList.toggle("open");
    return;
  }

  const selector = keyToButtonSelector[e.key];
  if (selector) {
    pressVisual(selector);
    const el = document.querySelector(selector);
    if (el) el.click();
  }
});

document.addEventListener("keyup", (e) => {
  let selector = null;
  if (/^[0-9]$/.test(e.key) || e.key === ".") {
    selector = `.btn[data-number="${e.key}"]`;
  } else {
    selector = keyToButtonSelector[e.key];
  }
  if (selector) releaseVisual(selector);
});


document.querySelector(".keypad")?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.number) {
    inputNumber(btn.dataset.number);
    return;
  }

  const action = btn.dataset.action;
  if (actionMap[action]) {
    actionMap[action]();
  }
});

document.getElementById("clearHistory")?.addEventListener("click", () => {
  saveHistory([]);
  renderHistory();
  historyPanel?.classList.remove("open");
});

document.getElementById("historyToggle")?.addEventListener("click", () => historyPanel?.classList.toggle("open"));
document.getElementById("closeHistory")?.addEventListener("click", () => historyPanel?.classList.remove("open"));

themeToggleBtn?.addEventListener("click", toggleTheme);
muteToggleBtn?.addEventListener("click", toggleMute);

loadTheme();
loadMuteState();
renderHistory();
updateDisplay();