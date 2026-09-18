let currentInput = "0";
let expressionTokens = [];
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
const modalEl = document.getElementById("keybindingsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const gotItBtn = document.getElementById("gotItBtn");

const btnSin = document.getElementById("btnSin");
const btnCos = document.getElementById("btnCos");
const btnTan = document.getElementById("btnTan");
const btnSquare = document.getElementById("btnSquare");
const btnSqrt = document.getElementById("btnSqrt");
const btnPower = document.getElementById("btnPower");
const btnLog = document.getElementById("btnLog");

function showKeybindingsModal() {
  if (modalEl) modalEl.classList.add("active");
}

function hideKeybindingsModal() {
  if (modalEl) modalEl.classList.remove("active");
  localStorage.setItem("calc-first-run-seen", "true");
}

function checkFirstRun() {
  const hasSeenModal = localStorage.getItem("calc-first-run-seen");
  if (!hasSeenModal) {
    showKeybindingsModal();
  }
}

closeModalBtn?.addEventListener("click", hideKeybindingsModal);
gotItBtn?.addEventListener("click", hideKeybindingsModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalEl?.classList.contains("active")) {
    hideKeybindingsModal();
  }
});

modalEl?.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    hideKeybindingsModal();
  }
});

function toggleShiftMode() {
  isShiftMode = !isShiftMode;
  if (btnShift) btnShift.classList.toggle("active-mode", isShiftMode);

  if (isShiftMode) {
    if (btnSin) {
      btnSin.textContent = "sin⁻¹";
      btnSin.dataset.action = "asin";
    }
    if (btnCos) {
      btnCos.textContent = "cos⁻¹";
      btnCos.dataset.action = "acos";
    }
    if (btnTan) {
      btnTan.textContent = "tan⁻¹";
      btnTan.dataset.action = "atan";
    }
    if (btnSquare) {
      btnSquare.textContent = "|x|";
      btnSquare.dataset.action = "abs";
    }
    if (btnSqrt) {
      btnSqrt.textContent = "d/dx";
      btnSqrt.dataset.action = "diff";
    }
    if (btnPower) {
      btnPower.textContent = "∫dx";
      btnPower.dataset.action = "integ";
    }
    if (btnLog) {
      btnLog.textContent = "∑";
      btnLog.dataset.action = "sum";
    }
  } else {
    if (btnSin) {
      btnSin.textContent = "sin";
      btnSin.dataset.action = "sin";
    }
    if (btnCos) {
      btnCos.textContent = "cos";
      btnCos.dataset.action = "cos";
    }
    if (btnTan) {
      btnTan.textContent = "tan";
      btnTan.dataset.action = "tan";
    }
    if (btnSquare) {
      btnSquare.textContent = "x²";
      btnSquare.dataset.action = "square";
    }
    if (btnSqrt) {
      btnSqrt.textContent = "√x";
      btnSqrt.dataset.action = "sqrt";
    }
    if (btnPower) {
      btnPower.textContent = "x^y";
      btnPower.dataset.action = "power";
    }
    if (btnLog) {
      btnLog.textContent = "log";
      btnLog.dataset.action = "log";
    }
  }
  playSound("operator");
}

function loadTheme() {
  const savedTheme = localStorage.getItem("calc-theme") || "light";
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

const PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
};

function evaluateInfix(tokens) {
  const values = [];
  const ops = [];

  const applyOp = () => {
    if (ops.length === 0 || values.length < 2) return "Error";
    const op = ops.pop();
    const b = values.pop();
    const a = values.pop();

    let result;
    switch (op) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "*":
        result = a * b;
        break;
      case "/":
        if (b === 0) return "Error";
        result = a / b;
        break;
      case "^":
        result = Math.pow(a, b);
        break;
      default:
        return "Error";
    }

    if (!Number.isFinite(result)) return "Error";
    values.push(result);
    return result;
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const num = Number(token);

    if (token !== "" && Number.isFinite(num)) {
      values.push(num);
      continue;
    }

    if (token === "(") {
      ops.push(token);
      continue;
    }

    if (token === ")") {
      while (ops.length > 0 && ops[ops.length - 1] !== "(") {
        if (applyOp() === "Error") return "Error";
      }
      if (ops.length === 0) return "Error";
      ops.pop(); // Remove '('
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(PRECEDENCE, token)) {
      // Unary minus fix: Pad with leading zero for negative numbers
      if (
        token === "-" &&
        (i === 0 ||
          tokens[i - 1] === "(" ||
          Object.prototype.hasOwnProperty.call(PRECEDENCE, tokens[i - 1]))
      ) {
        values.push(0);
      } // Corrected closing brace location

      const isRightAssociative = token === "^";

      while (
        ops.length > 0 &&
        ops[ops.length - 1] !== "(" &&
        (PRECEDENCE[ops[ops.length - 1]] > PRECEDENCE[token] ||
          (PRECEDENCE[ops[ops.length - 1]] === PRECEDENCE[token] &&
            !isRightAssociative))
      ) {
        if (applyOp() === "Error") return "Error";
      }

      ops.push(token);
      continue;
    }

    return "Error";
  }

  while (ops.length > 0) {
    if (ops[ops.length - 1] === "(" || ops[ops.length - 1] === ")")
      return "Error";
    if (applyOp() === "Error") return "Error";
  }

  if (values.length !== 1) return "Error";

  return cleanFloat(values[0]);
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

function openParen() {
  if (currentInput === "Error") return;

  // Auto-insert implicit multiplication if typing '(' after a finished operand
  if (currentInput !== "0" && currentInput !== "-" && !resultJustShown) {
    expressionTokens.push(currentInput);
    expressionTokens.push("*");
  } else if (resultJustShown) {
    expressionTokens = [];
    resultJustShown = false;
  }

  expressionTokens.push("(");
  currentInput = "0";
  updateDisplay();
  playSound("operator");
}

function closeParen() {
  if (currentInput === "Error" || expressionTokens.length === 0) return;

  if (currentInput !== "0" && currentInput !== "" && currentInput !== "-") {
    expressionTokens.push(currentInput);
    currentInput = "0";
  }

  expressionTokens.push(")");
  updateDisplay();
  playSound("operator");
}

function toggleSign() {
  if (currentInput === "Error" || currentInput === "0") return;

  if (currentInput.startsWith("-")) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = "-" + currentInput;
  }
  updateDisplay();
  playSound("number");
}

function safeTrig(fn, value) {
  const rad = toRadians(value);
  if (fn === "tan" && Math.abs(Math.cos(rad)) < 1e-10) return "Error";
  const result =
    fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : Math.tan(rad);
  return cleanFloat(result);
}

function safeInverseTrig(fn, value) {
  if ((fn === "asin" || fn === "acos") && (value < -1 || value > 1))
    return "Error";
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
    case "asin":
      result = safeInverseTrig("asin", value);
      break;
    case "acos":
      result = safeInverseTrig("acos", value);
      break;
    case "atan":
      result = safeInverseTrig("atan", value);
      break;
    case "abs":
      result = Math.abs(value);
      break;
    case "diff":
      result = differentiate(value);
      break;
    case "integ":
      result = integrate(value);
      break;
    case "sum":
      result = summation(value);
      break;
    default:
      return;
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
    prevOperandEl.textContent = expressionTokens.join(" ");
  }
}

function setError() {
  currentInput = "Error";
  expressionTokens = [];
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

  const lastToken = expressionTokens[expressionTokens.length - 1];

  if (
    op === "-" &&
    (currentInput === "0" || currentInput === "" || currentInput === "-") &&
    (PRECEDENCE[lastToken] ||
      lastToken === "(" ||
      expressionTokens.length === 0)
  ) {
    currentInput = "-";
    updateDisplay();
    playSound("number");
    return;
  }

  if (resultJustShown) {
    expressionTokens = [currentInput, op];
    resultJustShown = false;
  } else {
    if (currentInput !== "0" && currentInput !== "" && currentInput !== "-") {
      expressionTokens.push(currentInput);
    }

    if (
      expressionTokens.length > 0 &&
      PRECEDENCE[expressionTokens[expressionTokens.length - 1]] &&
      (currentInput === "0" || currentInput === "" || currentInput === "-")
    ) {
      expressionTokens[expressionTokens.length - 1] = op;
      currentInput = "0";
      updateDisplay();
      playSound("operator");
      return;
    }

    expressionTokens.push(op);
  }

  currentInput = "0";
  updateDisplay();
  playSound("operator");
}

function prepareFinalTokens(tokens, currentInput, resultJustShown) {
  const finalTokens = [...tokens];

  if (
    currentInput !== "" &&
    currentInput !== "0" &&
    currentInput !== "-" &&
    !resultJustShown
  ) {
    finalTokens.push(currentInput);
  }

  while (
    finalTokens.length > 0 &&
    PRECEDENCE[finalTokens[finalTokens.length - 1]]
  ) {
    finalTokens.pop();
  }

  if (finalTokens.length === 0) {
    return [];
  }

  let bracketDepth = 0;
  for (const token of finalTokens) {
    if (token === "(") bracketDepth++;
    else if (token === ")") bracketDepth--;
    if (bracketDepth < 0) return null;
  }

  while (bracketDepth > 0) {
    finalTokens.push(")");
    bracketDepth--;
  }

  return finalTokens;
}

function equals() {
  if (currentInput === "Error") return;

  const finalTokens = prepareFinalTokens(
    expressionTokens,
    currentInput,
    resultJustShown,
  );
  if (finalTokens === null) {
    setError();
    return;
  }

  if (finalTokens.length === 0) return;

  const result = evaluateInfix(finalTokens);

  if (result === "Error") {
    setError();
    return;
  }

  const expression = finalTokens.join(" ");

  addToHistory(expression, result.toString());

  currentInput = result.toString();
  expressionTokens = [];
  resultJustShown = true;

  updateDisplay();
  playSound("result");
}

function clearAll() {
  currentInput = "0";
  expressionTokens = [];
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
  const isValid =
    /^-?\d*\.?\d+(?:e[+-]?\d+)?$/i.test(cleaned) || /^-?\d+\.$/.test(cleaned);
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
  setTimeout(() => {
    currentOperandEl.style.color = original;
  }, 200);
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
  "open-paren": openParen,
  "close-paren": closeParen,
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
  "(": '[data-action="open-paren"]',
  ")": '[data-action="close-paren"]',
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

document
  .getElementById("historyToggle")
  ?.addEventListener("click", () => historyPanel?.classList.toggle("open"));
document
  .getElementById("closeHistory")
  ?.addEventListener("click", () => historyPanel?.classList.remove("open"));

themeToggleBtn?.addEventListener("click", toggleTheme);
muteToggleBtn?.addEventListener("click", toggleMute);

loadTheme();
loadMuteState();
renderHistory();
updateDisplay();
checkFirstRun();
