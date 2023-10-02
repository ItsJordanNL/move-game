const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let score = 0; // Initialize the score
let gameStarted = false; // Track if the game has started

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
  if (itemIsCollected(player, item)) {
    item.x = Math.random() * canvas.width;
    item.y = Math.random() * canvas.height;
    score++;
    console.log(score);
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

function startGame() {
  gameStarted = true;
  document.getElementById('startButton').style.display = 'none'; // Hide the "Start" button
  canvas.style.display = 'block'; // Show the canvas
  document.getElementById('score').style.display = 'block'; // Show the score
  update(); // Start the game loop
}

// Add an event listener to the "Start" button
document.getElementById('startButton').addEventListener('click', startGame);

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