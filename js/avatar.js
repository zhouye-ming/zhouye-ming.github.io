// ===== Avatar Upload & History (localStorage) =====

const AVATAR_HISTORY_KEY = 'avatar_history';
const AVATAR_CURRENT_KEY = 'avatar';
const MAX_HISTORY = 10;

const avatarInput = document.getElementById('avatarInput');
const avatarInner = document.getElementById('avatarInner');
const avatarFallback = document.getElementById('avatarFallback');
const historyContainer = document.getElementById('avatarHistory');

// ===== Load current avatar =====
loadCurrentAvatar();

function loadCurrentAvatar() {
  const savedAvatar = localStorage.getItem(AVATAR_CURRENT_KEY);
  if (savedAvatar) {
    setAvatarImage(savedAvatar);
  }
}

function setAvatarImage(dataUrl) {
  const oldImg = avatarInner.querySelector('img');
  if (oldImg) oldImg.remove();

  const img = document.createElement('img');
  img.src = dataUrl;
  img.alt = 'avatar';
  avatarInner.insertBefore(img, avatarFallback);
  avatarFallback.style.display = 'none';
}

// ===== History management =====
function getHistory() {
  try {
    const raw = localStorage.getItem(AVATAR_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(AVATAR_HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(dataUrl) {
  let history = getHistory();
  history = history.filter(url => url !== dataUrl);
  history.unshift(dataUrl);
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  saveHistory(history);
}

function deleteFromHistory(index) {
  let history = getHistory();
  if (index < 0 || index >= history.length) return;
  const deleted = history[index];
  history.splice(index, 1);
  saveHistory(history);
  renderHistory();

  if (deleted === localStorage.getItem(AVATAR_CURRENT_KEY)) {
    if (history.length > 0) {
      selectAvatar(history[0]);
    } else {
      localStorage.removeItem(AVATAR_CURRENT_KEY);
      const oldImg = avatarInner.querySelector('img');
      if (oldImg) oldImg.remove();
      avatarFallback.style.display = '';
    }
  }
}

function selectAvatar(dataUrl) {
  localStorage.setItem(AVATAR_CURRENT_KEY, dataUrl);
  setAvatarImage(dataUrl);
  renderHistory();
}

// ===== Render history gallery =====
function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyContainer.classList.remove('show');
    return;
  }

  historyContainer.innerHTML = '';
  const currentAvatar = localStorage.getItem(AVATAR_CURRENT_KEY);

  history.forEach((dataUrl, index) => {
    const item = document.createElement('div');
    item.className = 'history-item' + (dataUrl === currentAvatar ? ' active' : '');

    const thumb = document.createElement('img');
    thumb.src = dataUrl;
    thumb.alt = `历史 ${index + 1}`;

    const delBtn = document.createElement('button');
    delBtn.className = 'history-del';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteFromHistory(index);
    });

    item.appendChild(thumb);
    item.appendChild(delBtn);

    item.addEventListener('click', () => {
      selectAvatar(dataUrl);
    });

    historyContainer.appendChild(item);
  });

  historyContainer.classList.add('show');
}

// ===== Toggle history visibility =====
document.getElementById('avatarHistoryBtn').addEventListener('click', () => {
  if (historyContainer.classList.contains('show')) {
    historyContainer.classList.remove('show');
  } else {
    renderHistory();
  }
});

// ===== Upload =====
avatarInner.addEventListener('dblclick', () => {
  avatarInput.click();
});

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    selectAvatar(dataUrl);
    addToHistory(dataUrl);
  };
  reader.readAsDataURL(file);

  avatarInput.value = '';
});

// Migrate old single avatar into history if not already there
(function migrateOldAvatar() {
  const current = localStorage.getItem(AVATAR_CURRENT_KEY);
  const history = getHistory();
  if (current && history.length === 0) {
    saveHistory([current]);
  }
})();
