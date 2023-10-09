const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match the screen resolution
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0; // Initialize the score
let gameStarted = false; // Track if the game has started
let itemsCollected = 0; // Track the number of items collected
let startTime; // Store the start time
let timerInterval; // Store the interval ID for the timer

// Define player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 25,
  color: "#282b30",
  speed: 8,
  trail: [], // Array to store trail positions
  trailLength: 8, // Number of trail segments to show
};

// Define item object
const item = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  crossSize: 70, // Size of the cross
  crossWidth: 12, // Width of the cross
  color: 'red',
};

// Function to draw player
function drawPlayer() {
  // Draw the player's current position
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#165bfb'; // Set outline color to blue
  ctx.lineWidth = 10; // Set outline width
  ctx.stroke();
  ctx.closePath();

  // Draw the player's dot
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius - 3, 0, Math.PI * 2); // Smaller radius to create an outline effect
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();

  // Draw the player's trail with an outline
  for (let i = 0; i < player.trail.length; i++) {
    // Draw the outline of the trail
    ctx.beginPath();
    ctx.arc(player.trail[i].x, player.trail[i].y, player.radius - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(22, 91, 251, 0.8)'; // Set outline color to blue
    ctx.lineWidth = 2; // Set outline width
    ctx.stroke();
    ctx.closePath();

    // Draw the filled trail segment
    ctx.beginPath();
    ctx.arc(player.trail[i].x, player.trail[i].y, player.radius - 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(22, 91, 251, 0.0)'; // transparent blue for the trail
    ctx.fill();
    ctx.closePath();
  }
}

// Function to draw item
function drawItem() {
  // Draw the "X"-shaped item
  ctx.fillStyle = item.color;

  // Rotate the context by 45 degrees
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(Math.PI / 4); // 45 degrees in radians

  // Vertical stripe of the "X"
  ctx.fillRect(-item.crossWidth / 2, -item.crossSize / 2, item.crossWidth, item.crossSize);

  // Horizontal stripe of the "X"
  ctx.fillRect(-item.crossSize / 2, -item.crossWidth / 2, item.crossSize, item.crossWidth);

  // Restore the context to its original state
  ctx.restore();
}

// Function to update game elements
function update() {
  if (itemsCollected >= 10) {
    endGame();
    return;
  }

  // Update the player's trail
  player.trail.push({ x: player.x, y: player.y });
  if (player.trail.length > player.trailLength) {
    player.trail.shift(); // Remove the oldest trail segment
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

  return distance < player.radius + Math.sqrt(item.crossSize ** 2 + item.crossWidth ** 2) / 2;
}

// Function to update and display the score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score:\xa0\xa0${score} / 10`;
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
  document.getElementById('gameOverMessage').textContent = `Tijd:\xa0\xa0${elapsedTime} seconden`;
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
  document.getElementById('timer').textContent = 'Tijd: 0'; // Reset displayed timer
  startGame(); // Start a new game
}

// Function to update the timer
function updateTimer() {
  if (gameStarted) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // Calculate elapsed time in seconds
    document.getElementById('timer').textContent = `Tijd:\xa0\xa0${elapsedTime.toFixed(0)}s`;
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