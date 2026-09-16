let currentImnput = '0';
let previousInput = ''
let operator = null
let resultJustShown = false


const currentOperandEl = document.getElementById('currentOperand')
const prevOperandEl = document.getElementById('prevOperand')

function calculate(a, op, b) {
    a = parseFloat(a);
    b = parseFloat(b)

    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? "Error" : a / b;
      default:
        return;
    }
}