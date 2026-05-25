// ===== Canvas Background: Stars + Sakura Petals + Sparkles =====

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
let particles = [];
let sakuraPetals = [];
let sparkles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => {
  resize();
  initParticles();
  initSakura();
});

// ---- Star particles ----
function initParticles() {
  particles = [];
  const count = Math.min(150, Math.floor(W * H / 8000));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.05,
      angle: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.4 - 0.2,
      hue: 220 + Math.random() * 80,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    });
  }
}
initParticles();

// ---- Sakura Petals ----
function initSakura() {
  sakuraPetals = [];
  const count = Math.min(40, Math.floor(W * H / 30000));
  for (let i = 0; i < count; i++) {
    sakuraPetals.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 5 + Math.random() * 10,
      speedY: 0.2 + Math.random() * 0.5,
      speedX: 0.1 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * 40,
      swaySpeed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.4,
      petalType: Math.floor(Math.random() * 3),
    });
  }
}
initSakura();

// ---- Sparkles (occasional burst) ----
function addSparkle() {
  for (let i = 0; i < 3; i++) {
    sparkles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      life: 1,
      decay: 0.008 + Math.random() * 0.015,
      size: 1 + Math.random() * 2,
      hue: 260 + Math.random() * 60,
    });
  }
}
setInterval(addSparkle, 2000);

// ---- Draw a sakura petal shape ----
function drawPetal(ctx, x, y, size, rotation, opacity, type) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  grad.addColorStop(0, 'rgba(255, 180, 200, 0.8)');
  grad.addColorStop(0.6, 'rgba(255, 140, 180, 0.6)');
  grad.addColorStop(1, 'rgba(255, 100, 160, 0)');
  ctx.fillStyle = grad;

  ctx.beginPath();
  if (type === 0) {
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size * 0.5, -size * 0.3, size * 0.8, -size * 0.8, 0, -size);
    ctx.bezierCurveTo(-size * 0.8, -size * 0.8, -size * 0.5, -size * 0.3, 0, 0);
  } else if (type === 1) {
    ctx.ellipse(0, -size * 0.4, size * 0.5, size * 0.7, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.6, -size * 0.4, 0, -size);
    ctx.quadraticCurveTo(-size * 0.6, -size * 0.4, 0, 0);
  }
  ctx.fill();
  ctx.restore();
}

// ---- Main draw loop ----
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Stars
  const now = Date.now();
  for (const p of particles) {
    p.pulse += p.pulseSpeed;
    const flicker = 0.6 + 0.4 * Math.sin(p.pulse);

    p.y -= p.speed * 0.2;
    p.x += p.drift * 0.05;

    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity * flicker})`;
    ctx.fill();

    if (p.r > 1.2) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 50%, 60%, ${p.opacity * 0.06 * flicker})`;
      ctx.fill();
    }
  }

  // Sakura Petals
  for (const p of sakuraPetals) {
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(now * p.swaySpeed + p.phase) * 0.3;
    p.rotation += p.rotSpeed;

    if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    if (p.x > W + 20) p.x = -20;
    if (p.x < -20) p.x = W + 20;

    drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.opacity, p.petalType);
  }

  // Sparkles
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;

    if (s.life <= 0) { sparkles.splice(i, 1); continue; }

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(now * 0.003);
    ctx.globalAlpha = s.life;
    ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, 1)`;

    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle - 0.3) * s.size * 2, Math.sin(angle - 0.3) * s.size * 2);
      ctx.lineTo(Math.cos(angle) * s.size * 4, Math.sin(angle) * s.size * 4);
      ctx.lineTo(Math.cos(angle + 0.3) * s.size * 2, Math.sin(angle + 0.3) * s.size * 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  requestAnimationFrame(draw);
}
draw();
