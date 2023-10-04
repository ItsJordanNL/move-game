const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0; // Initialize the score
let gameStarted = false; // Track if the game has started
let itemsCollected = 0; // Track the number of items collected
let startTime; // Store the start time
let timerInterval; // Store the interval ID for the timer

// Define player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  color: "red",
  speed: 2,
};

// Define item object
const item = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: 8,
  color: "green",
};

// Function to draw player
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

// Function to draw item
function drawItem() {
  ctx.beginPath();
  ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
  ctx.fillStyle = item.color;
  ctx.fill();
  ctx.closePath();
}

// Function to update game elements
function update() {
  if (itemsCollected >= 10) {
    endGame();
    return;
  }

  if (itemIsCollected(player, item)) {
    item.x = Math.random() * canvas.width;
    item.y = Math.random() * canvas.height;
    score += 1; // Increment the score when collecting the item
    updateScore(); // Update the displayed score

    itemsCollected += 1; // Move this line outside of the if block
  }

  if (keys["ArrowUp"] && player.y - player.radius > 0) {
    player.y -= player.speed;
  }
  if (keys["ArrowDown"] && player.y + player.radius < canvas.height) {
    player.y += player.speed;
  }
  if (keys["ArrowLeft"] && player.x - player.radius > 0) {
    player.x -= player.speed;
  }
  if (keys["ArrowRight"] && player.x + player.radius < canvas.width) {
    player.x += player.speed;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawItem();
  if (gameStarted) {
    requestAnimationFrame(update); // Continue updating if the game has started
  }
  else {
    // Add this block to stop the game loop when the game is over
    canvas.style.display = 'none'; // Hide the canvas
    document.getElementById('score').style.display = 'none'; // Hide the score
    return;
  }
  console.log(gameStarted);
}

// Function to check if the item is collected
function itemIsCollected(player, item) {
  const distance = Math.sqrt(
    (player.x - item.x) ** 2 + (player.y - item.y) ** 2
  );
  return distance < player.radius + item.radius;
}

// Function to update and display the score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;
}

// Function to start the game
function startGame() {
  gameStarted = true;
  startTime = Date.now(); // Record the start time
  timerInterval = setInterval(updateTimer, 1000); // Start the timer
  document.getElementById('startDiv').style.display = 'none'; // Hide the "Start" button
  canvas.style.display = 'block'; // Show the canvas
  document.getElementById('score').style.display = 'block'; // Show the score
  document.getElementById('timer').style.display = 'block'; // Show the timer
  update(); // Start the game loop
}

// Function to end the game
function endGame() {
  gameStarted = false;
  clearInterval(timerInterval); // Stop the timer
  document.getElementById('gameOver').style.display = 'block'; // Show "Game Over" message
  document.getElementById('restartButton').style.display = 'block'; // Show "Restart" button
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
  document.getElementById('gameOver').textContent = `Game Over\nTime: ${elapsedTime} seconds`;
}

// Function to restart the game
function restartGame() {
  itemsCollected = 0; // Reset items collected
  score = 0; // Reset the score
  gameStarted = false;
  clearInterval(timerInterval); // Stop the timer
  document.getElementById('gameOver').style.display = 'none'; // Hide "Game Over" message
  document.getElementById('restartButton').style.display = 'none'; // Hide "Restart" button
  document.getElementById('score').textContent = 'Score: 0'; // Reset displayed score
  document.getElementById('timer').textContent = 'Time: 0'; // Reset displayed timer
  startGame(); // Start a new game
}

// Function to update the timer
function updateTimer() {
  if (gameStarted) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
    document.getElementById('timer').textContent = `Time: ${elapsedTime.toFixed(1)} seconds`;
  }
}

// Add event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Keyboard input handling
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Start the game loop
update();