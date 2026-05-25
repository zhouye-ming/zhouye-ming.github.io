// ===== Typewriter Effect =====

const phrases = [
  '正在加载下一段旅程...',
  '代码是写给人看的诗。',
  '在二次元与二进制之间游走。',
  '今天也在为了有趣而编码。',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typeEl = document.getElementById('type-text');

function typeLoop() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typeEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { isDeleting = true; typeLoop(); }, 2000);
      return;
    }
    setTimeout(typeLoop, 80);
  } else {
    typeEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 40);
  }
}
typeLoop();
