// --- Global DOM Elements ---
const currentOperandElement = document.getElementById("current-operand");
const previousOperandElement = document.getElementById("previous-operand");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// --- Calculator State Variables ---
let currentOperand = ""; // The number currently being entered
let previousOperand = ""; // The number before the operation
let operation = undefined; // The selected operation (+, -, *, /)
let calculated = false; // Flag to indicate a calculation has just finished
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

// --- Initialization ---

/**
 * Loads the theme preference from localStorage and applies it.
 */
function loadThemePreference() {
  const preference = localStorage.getItem("calculatorTheme");
  if (preference === "dark") {
    body.classList.add("dark-mode");
    themeToggle.querySelector("i").className = "fas fa-sun"; // Show sun icon
  } else {
    body.classList.remove("dark-mode");
    themeToggle.querySelector("i").className = "fas fa-moon"; // Show moon icon
  }
}

/**
 * Saves the current history array to localStorage.
 */
function saveHistory() {
  localStorage.setItem("calculatorHistory", JSON.stringify(history));
}

// --- Display and Formatting Functions ---

/**
 * Formats a number for display, adding commas for readability.
 * @param {string} number - The number string to format.
 * @returns {string} The formatted number string.
 */
function formatDisplayNumber(number) {
  const stringNumber = number.toString();
  const integerDigits = parseFloat(stringNumber.split(".")[0]);
  const decimalDigits = stringNumber.split(".")[1];
  let integerDisplay;

  if (isNaN(integerDigits)) {
    integerDisplay = "";
  } else {
    // Use toLocaleString for comma separation
    integerDisplay = integerDigits.toLocaleString("en", {
      maximumFractionDigits: 0,
    });
  }

  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`;
  } else {
    return integerDisplay;
  }
}

/**
 * Updates the display elements based on the current state variables.
 */
function updateDisplay() {
  // Current operand display
  currentOperandElement.innerText = formatDisplayNumber(currentOperand) || "0";

  // Previous operand display (full expression)
  if (operation != null) {
    previousOperandElement.innerText = `${formatDisplayNumber(
      previousOperand
    )} ${operation}`;
  } else {
    previousOperandElement.innerText = "";
  }
}

// --- Calculator Logic Functions ---

/**
 * Adds a number or decimal point to the current operand.
 * @param {string} number - The digit or decimal point to append.
 */
function appendNumber(number) {
  if (calculated) {
    // Start a new calculation after an '=' press
    currentOperand = "";
    previousOperand = "";
    operation = undefined;
    calculated = false;
  }

  if (number === "." && currentOperand.includes(".")) return;

  // Prevent starting with multiple zeros unless it's a decimal
  if (currentOperand === "0" && number !== ".") {
    currentOperand = number;
  } else {
    currentOperand = currentOperand.toString() + number.toString();
  }
}

/**
 * Clears all operands and the selected operation.
 */
function clear() {
  currentOperand = "";
  previousOperand = "";
  operation = undefined;
  calculated = false;
}

/**
 * Removes the last character from the current operand.
 */
function deleteLast() {
  currentOperand = currentOperand.toString().slice(0, -1);
  // If deleted to empty string, set it back to '0' for clean look, but keep it empty internally.
  if (currentOperand === "") {
    currentOperandElement.innerText = "0";
  }
}

/**
 * Sets the operation and moves the current operand to the previous operand.
 * @param {string} selectedOperation - The operation symbol (+, -, *, /).
 */
function chooseOperation(selectedOperation) {
  if (currentOperand === "") return;

  if (previousOperand !== "") {
    // If there's a pending operation, compute the result first
    compute();
  }

  // Set the new operation and shift the current value
  operation = selectedOperation;
  previousOperand = currentOperand;
  currentOperand = "";
  calculated = false;
}

/**
 * Performs the calculation based on the current state.
 */
function compute() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  // Stop if either operand is invalid
  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "/":
      // Handle division by zero error
      if (current === 0) {
        currentOperand = "Error: Div by 0";
        previousOperand = "";
        operation = undefined;
        calculated = true;
        updateDisplay();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }

  // Add calculation to history before resetting the display
  addToHistory(
    `${formatDisplayNumber(previousOperand)} ${operation} ${formatDisplayNumber(
      current
    )}`,
    formatDisplayNumber(computation)
  );

  // Reset state for the next step
  currentOperand = computation.toString();
  operation = undefined;
  previousOperand = "";
  calculated = true; // Mark as calculated
}

// --- Advanced Functions ---

/**
 * Calculates the square root of the current operand.
 */
function calculateSquareRoot() {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return;

  if (current < 0) {
    currentOperand = "Error: Invalid Input";
    previousOperand = "";
    operation = undefined;
    calculated = true;
  } else {
    const result = Math.sqrt(current);
    addToHistory(
      `√(${formatDisplayNumber(current)})`,
      formatDisplayNumber(result)
    );
    currentOperand = result.toString();
    previousOperand = "";
    operation = undefined;
    calculated = true;
  }
}

/**
 * Converts the current operand to a percentage (divides by 100).
 */
function calculatePercentage() {
  const current = parseFloat(currentOperand);
  if (isNaN(current)) return;

  // If an operation is pending, calculate percentage of the previous operand
  if (previousOperand && operation) {
    const prev = parseFloat(previousOperand);
    const result = prev * (current / 100);
    currentOperand = result.toString();
    // Do NOT set calculated = true, let the user hit '=' to finalize the operation
  } else {
    // Otherwise, simply divide the current number by 100
    const result = current / 100;
    currentOperand = result.toString();
    calculated = true;
  }
}

// --- History Functions ---

/**
 * Adds a new calculation entry to the history.
 * @param {string} expression - The full calculation expression.
 * @param {string} result - The result of the calculation.
 */
function addToHistory(expression, result) {
  // Add the new item to the start of the history array
  history.unshift({ expression, result });
  // Keep history limited (e.g., 10 entries)
  if (history.length > 10) {
    history.pop();
  }
  saveHistory();
  renderHistory();
}

/**
 * Renders the history list in the panel.
 */
function renderHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML =
      '<li style="text-align: center; opacity: 0.6; padding: 15px 0;">No history yet.</li>';
    clearHistoryBtn.disabled = true;
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div style="font-size: 0.8em; opacity: 0.7;">${item.expression}</div>
            <div style="font-size: 1.1em; font-weight: 600;">= ${item.result}</div>
        `;
    // Add a click listener to load the result back into the calculator
    li.addEventListener("click", () => {
      currentOperand = item.result.replace(/,/g, ""); // Remove commas for calculation
      previousOperand = "";
      operation = undefined;
      calculated = true;
      updateDisplay();
    });
    historyList.appendChild(li);
  });
  clearHistoryBtn.disabled = false;
}

/**
 * Clears the history array and updates localStorage/UI.
 */
function clearHistory() {
  if (
    history.length > 0 &&
    confirm("Are you sure you want to clear all calculation history?")
  ) {
    history = [];
    saveHistory();
    renderHistory();
  }
}

// --- Dark/Light Mode Toggle ---

/**
 * Toggles the dark mode class on the body and saves the preference.
 */
function toggleTheme() {
  const isDark = body.classList.toggle("dark-mode");

  // Save preference to localStorage
  const preference = isDark ? "dark" : "light";
  localStorage.setItem("calculatorTheme", preference);

  // Update the icon
  themeToggle.querySelector("i").className = isDark
    ? "fas fa-sun"
    : "fas fa-moon";
}

// --- Event Listeners ---

// 1. Button Click Handling
document.querySelectorAll(".buttons-grid button").forEach((button) => {
  button.addEventListener("click", () => {
    // Handle number and decimal buttons
    if (button.dataset.number != null) {
      appendNumber(button.innerText);
    } else if (button.dataset.action === "decimal") {
      appendNumber(".");
    }
    // Handle operation buttons
    else if (button.classList.contains("operator")) {
      chooseOperation(button.innerText);
    }
    // Handle equals
    else if (button.dataset.action === "equals") {
      compute();
    }
    // Handle clear
    else if (button.dataset.action === "clear") {
      clear();
    }
    // Handle delete
    else if (button.dataset.action === "delete") {
      deleteLast();
    }
    // Handle advanced functions
    else if (button.dataset.action === "percent") {
      calculatePercentage();
    } else if (button.dataset.action === "sqrt") {
      calculateSquareRoot();
    }

    updateDisplay();
  });
});

// 2. Keyboard Input Handling
document.addEventListener("keydown", (e) => {
  // Prevent spacebar from activating buttons
  if (e.key === " ") e.preventDefault();

  // Map keyboard keys to calculator actions
  if (/[0-9]/.test(e.key)) {
    appendNumber(e.key);
  } else if (e.key === ".") {
    appendNumber(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault(); // Prevent default enter behavior
    compute();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Escape") {
    clear();
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    chooseOperation(e.key);
  }

  updateDisplay();
});

// 3. Utility Button Listeners
themeToggle.addEventListener("click", toggleTheme);
clearHistoryBtn.addEventListener("click", clearHistory);

// 4. Initial Load
document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference();
  renderHistory();
  updateDisplay(); // Ensure initial '0' is displayed
});
