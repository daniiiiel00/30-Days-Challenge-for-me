// --- Game Constants & Variables ---
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreDisplay = document.getElementById("final-score");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const playAgainButton = document.getElementById("play-again-button");

// Game Grid Settings
const GRID_SIZE = 20; // Number of cells wide/high
let TILE_SIZE; // Calculated based on canvas size
const INITIAL_SPEED = 150; // Milliseconds per move (slower = larger number)
const SPEED_INCREMENT = 5; // How much faster the game gets (smaller number = faster)

// Game State
let snake = [];
let food = {};
let dx = 0; // Direction x (1, -1, or 0)
let dy = 0; // Direction y (1, -1, or 0)
let score = 0;
let highScore = 0;
let gameLoopInterval;
let currentSpeed = INITIAL_SPEED;
let isPlaying = false;
let isPaused = false;
let directionQueue = []; // For handling rapid key presses

// --- Initialization ---

// Set Canvas size dynamically based on its CSS size
function setCanvasSize() {
  // Get the computed size from CSS
  const computedStyle = window.getComputedStyle(canvas);
  canvas.width = parseInt(computedStyle.width);
  canvas.height = parseInt(computedStyle.height);
  TILE_SIZE = canvas.width / GRID_SIZE;
}

window.addEventListener("resize", () => {
  setCanvasSize();
  if (isPlaying && !isPaused) drawGame(); // Redraw if game is active
});

// Load high score from localStorage
function loadHighScore() {
  highScore = parseInt(localStorage.getItem("snakeHighScore") || 0);
  highScoreDisplay.textContent = highScore;
}

// Save high score to localStorage
function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

// Reset all game state variables
function resetGame() {
  setCanvasSize();
  clearInterval(gameLoopInterval);
  snake = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  dx = 1;
  dy = 0;
  score = 0;
  currentSpeed = INITIAL_SPEED;
  isPlaying = false;
  isPaused = false;
  directionQueue = [];
  scoreDisplay.textContent = score;
  gameOverScreen.classList.add("hidden");
  drawGame(); // Draw initial state
  updateControls(false, false);
}

// --- Drawing Functions ---

// Draw the game board, snake, and food
function drawGame() {
  // 1. Clear the canvas
  ctx.fillStyle = "#1a1a1a"; // Canvas background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Food
  ctx.fillStyle = "#d32f2f"; // Food color
  ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

  // 3. Draw Snake
  ctx.fillStyle = "#388e3c"; // Snake body color
  snake.forEach((segment, index) => {
    // Subtle color change for the head
    if (index === 0) {
      ctx.fillStyle = "#4caf50";
    } else {
      ctx.fillStyle = "#388e3c";
    }
    ctx.fillRect(
      segment.x * TILE_SIZE,
      segment.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  });
}

// --- Game Logic ---

// Generate food at a random position not occupied by the snake
function generateFood() {
  let newFood = {};
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (
    snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
  );
  food = newFood;
}

// Main game loop function
function moveSnake() {
  if (!isPlaying || isPaused) return;

  // Process direction queue
  if (directionQueue.length > 0) {
    const nextDirection = directionQueue.shift();
    setDirection(nextDirection.newDx, nextDirection.newDy);
  }

  // New head position
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Collision Detection
  if (
    head.x < 0 ||
    head.x >= GRID_SIZE || // Wall collision
    head.y < 0 ||
    head.y >= GRID_SIZE ||
    snake.some(
      (segment, index) =>
        index > 0 && segment.x === head.x && segment.y === head.y
    ) // Self-collision
  ) {
    endGame();
    return;
  }

  // Add new head to the front of the snake
  snake.unshift(head);

  // Check for food consumption
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    generateFood();

    // Speed up the game slightly
    if (currentSpeed - SPEED_INCREMENT > 50) {
      // Limit max speed
      currentSpeed -= SPEED_INCREMENT;
    }

    // Restart the game loop with the new speed
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(moveSnake, currentSpeed);
  } else {
    // If no food, remove the tail (snake moves)
    snake.pop();
  }

  drawGame();
}

// --- Game State Management ---

function startGame() {
  if (isPlaying) return;

  resetGame();
  generateFood();
  isPlaying = true;
  isPaused = false;
  updateControls(true, false);

  // Start the game loop
  gameLoopInterval = setInterval(moveSnake, currentSpeed);
}

function pauseGame() {
  if (!isPlaying) return;

  isPaused = !isPaused;

  if (isPaused) {
    clearInterval(gameLoopInterval);
    pauseButton.textContent = "Resume";
  } else {
    gameLoopInterval = setInterval(moveSnake, currentSpeed);
    pauseButton.textContent = "Pause";
  }
}

function endGame() {
  isPlaying = false;
  clearInterval(gameLoopInterval);
  saveHighScore();

  finalScoreDisplay.textContent = `You scored: ${score}`;
  gameOverScreen.classList.remove("hidden");
  updateControls(false, true);
}

// Helper to enable/disable controls
function updateControls(gameStarted, gameOver) {
  startButton.disabled = gameStarted || gameOver;
  pauseButton.disabled = !gameStarted || gameOver;
  restartButton.disabled = !gameStarted && !gameOver;
}

// --- Controls ---

// Set snake direction, preventing instant reversal
function setDirection(newDx, newDy) {
  // Prevent moving back onto the immediate segment (e.g., left when moving right)
  if (Math.abs(dx + newDx) !== 0 || Math.abs(dy + newDy) !== 0) {
    dx = newDx;
    dy = newDy;
  }
}

// Keyboard input handler
document.addEventListener("keydown", (event) => {
  if (!isPlaying || isPaused) return;

  let newDx = dx;
  let newDy = dy;

  switch (event.key) {
    case "ArrowUp":
    case "w":
    case "W":
      newDx = 0;
      newDy = -1;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      newDx = 0;
      newDy = 1;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      newDx = -1;
      newDy = 0;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      newDx = 1;
      newDy = 0;
      break;
    case "Escape":
      pauseGame();
      return; // Don't queue pause
  }

  // Only queue if it's a valid direction change
  if (
    (newDx !== dx || newDy !== dy) &&
    (Math.abs(dx + newDx) !== 0 || Math.abs(dy + newDy) !== 0)
  ) {
    // Queue the next direction to ensure smooth turning, especially at higher speeds
    directionQueue.push({ newDx, newDy });
  }
});

// Mobile/Touch input handler
document
  .getElementById("mobile-controls")
  .addEventListener("click", (event) => {
    if (!isPlaying || isPaused) return;
    const button = event.target.closest(".ctrl-btn");
    if (!button) return;

    let newDx = dx;
    let newDy = dy;

    switch (button.id) {
      case "up-button":
        newDx = 0;
        newDy = -1;
        break;
      case "down-button":
        newDx = 0;
        newDy = 1;
        break;
      case "left-button":
        newDx = -1;
        newDy = 0;
        break;
      case "right-button":
        newDx = 1;
        newDy = 0;
        break;
    }

    if (
      (newDx !== dx || newDy !== dy) &&
      (Math.abs(dx + newDx) !== 0 || Math.abs(dy + newDy) !== 0)
    ) {
      directionQueue.push({ newDx, newDy });
    }
  });

// --- Event Listeners ---
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", startGame);

// --- Initial Setup ---
loadHighScore();
resetGame(); // Sets initial snake, food (implicitly), and draws the canvas
