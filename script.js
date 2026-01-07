const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// الكرة البيضاء
let cueBall = {
  x: 200,
  y: 450,
  r: 10,
  vx: 0,
  vy: 0
};

// الكرات
let balls = [
  { x: 200, y: 150, r: 10, alive: true },
  { x: 180, y: 130, r: 10, alive: true },
  { x: 220, y: 130, r: 10, alive: true }
];

let dragging = false;
let startX = 0;
let startY = 0;

// ماوس + لمس
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("touchstart", startDrag);

canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchend", endDrag);

function startDrag(e) {
  dragging = true;
  const pos = getPos(e);
  startX = pos.x;
  startY = pos.y;
}

function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  const pos = getPos(e);
  cueBall.vx = (startX - pos.x) * 0.1;
  cueBall.vy = (startY - pos.y) * 0.1;
}

function getPos(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - canvas.offsetLeft,
      y: e.touches[0].clientY - canvas.offsetTop
    };
  }
  return { x: e.offsetX, y: e.offsetY };
}

function update() {
  cueBall.x += cueBall.vx;
  cueBall.y += cueBall.vy;

  cueBall.vx *= 0.98;
  cueBall.vy *= 0.98;

  // حدود الطاولة
  if (cueBall.x < 10 || cueBall.x > canvas.width - 10) cueBall.vx *= -1;
  if (cueBall.y < 10 || cueBall.y > canvas.height - 10) cueBall.vy *= -1;

  // تصادم مع الكرات
  balls.forEach(ball => {
    if (!ball.alive) return;
    const dx = cueBall.x - ball.x;
    const dy = cueBall.y - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < cueBall.r + ball.r) {
      ball.alive = false;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // الكرة البيضاء
  ctx.beginPath();
  ctx.arc(cueBall.x, cueBall.y, cueBall.r, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // الكرات
  balls.forEach(ball => {
    if (!ball.alive) return;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  cueBall.x = 200;
  cueBall.y = 450;
  cueBall.vx = 0;
  cueBall.vy = 0;
  balls.forEach(b => (b.alive = true));
}

loop();
