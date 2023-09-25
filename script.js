const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: "red",
  speed: 5,
};

// Define item object
const item = {
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: 10,
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
  requestAnimationFrame(update);
}

// Function to check if the item is collected
function itemIsCollected(player, item) {
  const distance = Math.sqrt(
    (player.x - item.x) ** 2 + (player.y - item.y) ** 2
  );

  return distance < player.radius + item.radius;
}

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