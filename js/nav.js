// ===== Navigation Menu Toggle =====

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const mainContent = document.getElementById('mainContent');
let navOpen = false;

navToggle.addEventListener('click', () => {
  navOpen = !navOpen;
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open');
  mainContent.classList.toggle('shifted');
});

// Close nav when any nav item is clicked
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navOpen = false;
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    mainContent.classList.remove('shifted');
  });
});
