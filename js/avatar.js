// ===== Avatar Upload (双击头像上传, 仅主人可知) =====

const avatarInput = document.getElementById('avatarInput');
const avatarInner = document.getElementById('avatarInner');
const avatarFallback = document.getElementById('avatarFallback');

// 页面加载时从 localStorage 恢复头像
const savedAvatar = localStorage.getItem('avatar');
if (savedAvatar) {
  const img = document.createElement('img');
  img.src = savedAvatar;
  img.alt = 'avatar';
  avatarInner.insertBefore(img, avatarFallback);
  avatarFallback.style.display = 'none';
}

// 双击头像触发文件选择
avatarInner.addEventListener('dblclick', () => {
  avatarInput.click();
});

// 选择文件后读取并保存
avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;

    const oldImg = avatarInner.querySelector('img');
    if (oldImg) oldImg.remove();

    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'avatar';
    avatarInner.insertBefore(img, avatarFallback);
    avatarFallback.style.display = 'none';

    localStorage.setItem('avatar', dataUrl);
  };
  reader.readAsDataURL(file);

  avatarInput.value = '';
});
