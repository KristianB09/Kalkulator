class Calculator {
  constructor(previousOperandText, currentOperandText) {
    this.previousOperandText = previousOperandText;
    this.currentOperandText = currentOperandText;
    this.clear();
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case "\uFF0B":
      case "+":
        computation = prev + current;
        break;
      case "\uFF0D":
      case "-":
        computation = prev - current;
        break;
      case "\uFF0A":
      case "*":
        computation = prev * current;
        break;
      case "\uFF0F":
      case "/":
        computation = prev / current;
        break;
      default:
        return;
    }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
  }

  negative() {
    if (this.currentOperand === null) return;
    const x = Math.sign(parseFloat(this.currentOperand));
    const stringOperand = this.currentOperand.toString();
    if (x === 1) {
      this.currentOperand = "-" + stringOperand;
    } else if (x === -1) {
      const substring = stringOperand.substring(1);
      this.currentOperand = substring;
    } else {
      return;
    }
  }

  squareRoot() {
    const sqrtValue = parseFloat(this.currentOperand);
    if (sqrtValue === "" || sqrtValue <= 0) return;
    const sqrtResult = Math.sqrt(sqrtValue);
    this.currentOperand = sqrtResult;
  }

  getOutputNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerOutput;
    if (isNaN(integerDigits)) {
      integerOutput = "";
    } else {
      integerOutput = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerOutput}.${decimalDigits}`;
    } else {
      return integerOutput;
    }
  }

  updateOutput() {
    this.currentOperandText.innerText = this.getOutputNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandText.innerText = `${this.getOutputNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandText.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const clearButton = document.querySelector("[data-all-clear]");
const deleteButton = document.querySelector("[data-delete]");
const sqrtButton = document.querySelector("[data-sqrt]");
const negativeButton = document.querySelector("[data-negative]");
const previousOperandText = document.querySelector("[data-previous-operand]");
const currentOperandText = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandText, currentOperandText);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateOutput();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateOutput();
  });
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateOutput();
});

clearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateOutput();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateOutput();
});

sqrtButton.addEventListener("click", (button) => {
  calculator.squareRoot();
  calculator.updateOutput();
});

negativeButton.addEventListener("click", (button) => {
  calculator.negative();
  calculator.updateOutput();
});

document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (!isNaN(parseFloat(key))) {
    calculator.appendNumber(key);
    calculator.updateOutput();
  } else {
    switch (key) {
      case "+":
      case "-":
      case "*":
      case "/":
        calculator.chooseOperation(key);
        calculator.updateOutput();
        break;
      /*case "Enter":
        calculator.compute();
        break;*/
      case "Backspace":
        deleteButton.click();
        break;
      case "Escape":
        clearButton.click();
        break;
    }
  }
});
