// DOM Element Selection
const timeValues = {
  days: document.getElementById("days-value"),
  hours: document.getElementById("hours-value"),
  minutes: document.getElementById("minutes-value"),
  seconds: document.getElementById("seconds-value"),
  ms: document.getElementById("ms-value"),
};

const inputFields = {
  days: document.getElementById("input-days"),
  hours: document.getElementById("input-hours"),
  minutes: document.getElementById("input-minutes"),
  seconds: document.getElementById("input-seconds"),
};

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const statusMessage = document.getElementById("status-message");
const progressBar = document.querySelector(".progress-bar");
const progressCircle = document.querySelector(".progress-circle");

// Timer State
let totalDurationMs = 0; // The total time set by the user in milliseconds
let remainingTimeMs = 0; // The current remaining time
let startTime; // Timestamp of when the timer started/resumed
let lastUpdateTime; // Timestamp of the last frame update
let animationFrameId; // ID returned by requestAnimationFrame
let isRunning = false;
let isFinished = false;

// Progress Circle Constants (for SVG drawing)
const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

progressBar.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;

// --- Core Logic Functions ---

// Calculates the remaining time and updates the display (high precision using requestAnimationFrame)
function updateTimer(timestamp) {
  if (!isRunning || isFinished) return;

  if (!lastUpdateTime) {
    lastUpdateTime = timestamp;
  }

  // Calculate time elapsed since the last frame
  const elapsed = timestamp - lastUpdateTime;
  lastUpdateTime = timestamp;

  remainingTimeMs -= elapsed;

  if (remainingTimeMs <= 0) {
    remainingTimeMs = 0;
    isFinished = true;
    isRunning = false;
    clearIntervals();
    handleTimerEnd();
    updateDisplay(remainingTimeMs);
    return;
  }

  updateDisplay(remainingTimeMs);
  updateProgress();

  animationFrameId = requestAnimationFrame(updateTimer);
}

// Converts total milliseconds into D/H/M/S/MS components for display
function updateDisplay(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor(ms % 1000);

  const timeParts = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    ms: milliseconds,
  };

  // Update each time unit with the flip animation
  Object.keys(timeParts).forEach((unit) => {
    const newValue = formatTimeValue(timeParts[unit], unit === "ms" ? 3 : 2);
    const currentValue = timeValues[unit].getAttribute("data-time");

    if (newValue !== currentValue) {
      // Apply flip animation
      timeValues[unit].classList.remove("flip-in");
      timeValues[unit].classList.add("flip-out");

      // Wait for flip-out animation to finish, then update and flip-in
      setTimeout(() => {
        timeValues[unit].textContent = newValue;
        timeValues[unit].setAttribute("data-time", newValue);
        timeValues[unit].classList.remove("flip-out");
        timeValues[unit].classList.add("flip-in");
      }, 250); // Half the animation duration
    }
  });
}

// Formats a number to required length (e.g., 5 -> '05' or 5 -> '005')
function formatTimeValue(value, length) {
  return String(value).padStart(length, "0");
}

// Updates the circular progress bar
function updateProgress() {
  const progress = 1 - remainingTimeMs / totalDurationMs; // 0 (start) to 1 (end)
  const offset = progress * CIRCLE_CIRCUMFERENCE;
  progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE - offset;

  // Optional: Change bar color based on progress (e.g., to red when low)
  if (
    remainingTimeMs < 10000 &&
    !progressCircle.classList.contains("low-time")
  ) {
    progressCircle.classList.add("low-time");
    progressBar.style.stroke = "#ff4081"; // Accent color for low time
  } else if (
    remainingTimeMs >= 10000 &&
    progressCircle.classList.contains("low-time")
  ) {
    progressCircle.classList.remove("low-time");
    progressBar.style.stroke = "var(--accent-color)";
  }
}

// --- Control Handlers ---

function handleStart() {
  if (remainingTimeMs <= 0 || isRunning) return;

  isRunning = true;
  isFinished = false;
  lastUpdateTime = undefined; // Reset last update time for rAF

  // Set controls state
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  Object.values(inputFields).forEach((input) => (input.disabled = true));
  statusMessage.textContent = "RUNNING";

  animationFrameId = requestAnimationFrame(updateTimer);
}

function handlePause() {
  if (!isRunning) return;

  isRunning = false;
  clearIntervals();

  // Set controls state
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  Object.values(inputFields).forEach((input) => (input.disabled = true));
  statusMessage.textContent = "PAUSED";
}

function handleReset() {
  clearIntervals();

  // Reset state
  remainingTimeMs = totalDurationMs;
  isRunning = false;
  isFinished = false;

  // Reset controls and display
  startBtn.disabled = totalDurationMs === 0;
  pauseBtn.disabled = true;
  resetBtn.disabled = true;
  Object.values(inputFields).forEach((input) => (input.disabled = false));
  statusMessage.textContent = totalDurationMs > 0 ? "READY" : "SET TIME";

  // Reset visual elements
  updateDisplay(remainingTimeMs);
  progressBar.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;
  progressBar.style.stroke = "var(--accent-color)";
  progressCircle.classList.remove("low-time");
}

function handleTimerEnd() {
  statusMessage.textContent = "DONE!";
  // Optional: Play sound or vibration here
  new Audio("alarm.mp3").play();

  startBtn.disabled = true;
  pauseBtn.disabled = true;
  resetBtn.disabled = false;
}

function clearIntervals() {
  cancelAnimationFrame(animationFrameId);
}

// --- Input & Initialization ---

function calculateDuration() {
  const d = parseInt(inputFields.days.value) || 0;
  const h = parseInt(inputFields.hours.value) || 0;
  const m = parseInt(inputFields.minutes.value) || 0;
  const s = parseInt(inputFields.seconds.value) || 0;

  totalDurationMs =
    d * 24 * 3600 * 1000 + h * 3600 * 1000 + m * 60 * 1000 + s * 1000;

  remainingTimeMs = totalDurationMs;

  const timeIsSet = totalDurationMs > 0;
  startBtn.disabled = !timeIsSet;
  resetBtn.disabled = !timeIsSet;

  if (timeIsSet) {
    updateDisplay(remainingTimeMs);
    statusMessage.textContent = "READY";
  } else {
    updateDisplay(0);
    statusMessage.textContent = "SET TIME";
  }
}

// Event Listeners
startBtn.addEventListener("click", handleStart);
pauseBtn.addEventListener("click", handlePause);
resetBtn.addEventListener("click", handleReset);

Object.values(inputFields).forEach((input) => {
  input.addEventListener("input", calculateDuration);
});

// Initial setup
calculateDuration();
