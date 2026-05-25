// ===== Hash-based Client-side Router (compatible with file://) =====

const routeMap = {
  'zhouyeming': { panel: null, hero: true },
  'about':      { panel: 'about', hero: false },
  'skills':     { panel: 'skills', hero: false },
  'projects':   { panel: 'projects', hero: false },
  'contact':    { panel: 'contact', hero: false },
};

function handleRoute() {
  let hash = location.hash.replace(/^#/, '') || 'zhouyeming';

  // Unknown hash → fallback to home
  if (!routeMap[hash]) {
    location.hash = 'zhouyeming';
    return; // hashchange will fire again
  }

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
  document.getElementById('panelOverlay').classList.remove('show');
  document.getElementById('hero').classList.add('hidden');

  const route = routeMap[hash];
  if (route.hero) document.getElementById('hero').classList.remove('hidden');
  if (route.panel) {
    document.getElementById('panel-' + route.panel).classList.add('open');
    document.getElementById('panelOverlay').classList.add('show');
  }
}

window.navigate = (path) => {
  // '/about' → 'about'
  location.hash = path.replace(/^\//, '');
};

// Overlay click → back to hub
document.getElementById('panelOverlay').addEventListener('click', () => {
  navigate('/zhouyeming');
});

// Escape key → back to hub
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    navigate('/zhouyeming');
    // Close nav menu if open
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainContent = document.getElementById('mainContent');
    if (navToggle.classList.contains('open')) {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      mainContent.classList.remove('shifted');
    }
  }
});

window.addEventListener('hashchange', handleRoute);

// Initial route
if (!location.hash) {
  location.hash = 'zhouyeming';
} else {
  handleRoute();
}
