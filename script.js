/**
 * Pixel Portfolio Engine
 * Features: 8-Bit Web Audio Synthesizer, Canvas Pixel Starfield, Custom Pixel Cursor,
 * CRT Scanline Controller, Pixel Modal Lightbox Viewer, and Theme Toggle.
 */

// ================= 1. Web Audio API 8-Bit Sound Synthesizer =================
let audioCtx = null;
let sfxEnabled = localStorage.getItem('pixel_sfx') !== 'false';

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function play8BitTone(freq, type = 'square', duration = 0.08, vol = 0.08) {
  if (!sfxEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// Sound presets
const SFX = {
  hover: () => play8BitTone(440, 'square', 0.03, 0.03),
  click: () => {
    play8BitTone(523.25, 'square', 0.05, 0.07);
    setTimeout(() => play8BitTone(659.25, 'square', 0.07, 0.07), 40);
  },
  modalOpen: () => {
    play8BitTone(330, 'square', 0.06, 0.06);
    setTimeout(() => play8BitTone(440, 'square', 0.06, 0.06), 60);
    setTimeout(() => play8BitTone(587, 'square', 0.1, 0.07), 120);
  },
  modalClose: () => {
    play8BitTone(587, 'square', 0.05, 0.06);
    setTimeout(() => play8BitTone(330, 'square', 0.08, 0.06), 50);
  },
  toggle: () => {
    play8BitTone(600, 'triangle', 0.08, 0.08);
    setTimeout(() => play8BitTone(900, 'square', 0.1, 0.08), 70);
  }
};

// ================= 2. Custom Pixel Cursor =================
const customCursor = document.getElementById('custom-cursor');
let mouseX = -100, mouseY = -100;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (customCursor) {
    customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
});

// Interactive hover effects with sound
function setupCursorHovers() {
  const hoverableElements = document.querySelectorAll(
    'a, button, .skill-slot, .project-cartridge, .quest-item-card, input, select'
  );

  hoverableElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (customCursor) customCursor.classList.add('hovering');
      SFX.hover();
    });
    el.addEventListener('mouseleave', () => {
      if (customCursor) customCursor.classList.remove('hovering');
    });
  });
}

// ================= 3. Theme, Audio & CRT Controllers =================
const themeToggle = document.getElementById('theme-toggle');
const sfxToggle = document.getElementById('sfx-toggle');
const crtToggle = document.getElementById('crt-toggle');
const crtOverlay = document.getElementById('crt-overlay');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

// SFX Toggle Setup
function updateSfxButton() {
  if (sfxToggle) {
    sfxToggle.textContent = sfxEnabled ? '🔊 SFX' : '🔇 MUTE';
  }
}
updateSfxButton();

if (sfxToggle) {
  sfxToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    localStorage.setItem('pixel_sfx', sfxEnabled);
    updateSfxButton();
    if (sfxEnabled) SFX.toggle();
  });
}

// Theme Setup
const savedTheme = localStorage.getItem('pixel_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pixel_theme', next);
    SFX.toggle();
  });
}

// CRT Scanlines Setup
let crtEnabled = localStorage.getItem('pixel_crt') === 'true';
if (crtOverlay) {
  crtOverlay.style.display = crtEnabled ? 'block' : 'none';
}

if (crtToggle) {
  crtToggle.addEventListener('click', () => {
    crtEnabled = !crtEnabled;
    localStorage.setItem('pixel_crt', crtEnabled);
    if (crtOverlay) {
      crtOverlay.style.display = crtEnabled ? 'block' : 'none';
    }
    SFX.toggle();
  });
}

// Mobile Menu
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    SFX.click();
  });
}

// ================= 4. Canvas Pixel Starfield =================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 45;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.floor(Math.random() * 3) * 2 + 2, // Pixel step (2, 4, 6)
      speed: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.6 ? '#4dd9e8' : Math.random() > 0.5 ? '#e84d8a' : '#f5c842',
      twinkle: Math.random() * Math.PI * 2
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.getAttribute('data-theme');

    stars.forEach((star) => {
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = canvas.height;
        star.x = Math.random() * canvas.width;
      }
      star.twinkle += 0.05;
      const opacity = Math.sin(star.twinkle) * 0.4 + 0.6;

      ctx.fillStyle = theme === 'light' ? '#1a3a0a' : star.color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    });

    ctx.globalAlpha = 1.0;
    requestAnimationFrame(renderStars);
  }
  renderStars();
}

// ================= 5. Pixel Modal / Lightbox (NO DOWNLOADS) =================
const modal = document.getElementById('pixel-modal');
const modalCloseBtn = document.getElementById('modal-close');
const modalTitleText = document.getElementById('modal-title-text');
const modalImg = document.getElementById('modal-img');
const modalMetaText = document.getElementById('modal-meta-text');
const modalHeadingText = document.getElementById('modal-heading-text');
const modalDescText = document.getElementById('modal-desc-text');

function openModal(title, mediaSrc, desc, meta) {
  if (!modal) return;
  modalTitleText.textContent = 'INSPECT // ' + title.toUpperCase();
  modalHeadingText.textContent = title;
  modalDescText.textContent = desc;
  modalMetaText.textContent = meta || 'Item Verified';

  const isPdf = mediaSrc.toLowerCase().endsWith('.pdf');
  const modalImg = document.getElementById('modal-img');
  const modalPdf = document.getElementById('modal-pdf');

  if (isPdf) {
    if (modalImg) {
      modalImg.src = '';
      modalImg.style.display = 'none';
    }
    if (modalPdf) {
      modalPdf.src = mediaSrc;
      modalPdf.style.display = 'block';
    }
  } else {
    if (modalPdf) {
      modalPdf.src = '';
      modalPdf.style.display = 'none';
    }
    if (modalImg) {
      modalImg.src = mediaSrc;
      modalImg.alt = title;
      modalImg.style.display = 'block';
    }
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  SFX.modalOpen();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  const modalPdf = document.getElementById('modal-pdf');
  if (modalPdf) modalPdf.src = '';
  
  SFX.modalClose();
}

// Attach inspect triggers
document.querySelectorAll('.inspect-btn').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = trigger.getAttribute('data-title') || trigger.querySelector('.quest-title, .project-name')?.textContent || 'Item';
    const imgSrc = trigger.getAttribute('data-img') || trigger.querySelector('img')?.src || '';
    const desc = trigger.getAttribute('data-desc') || trigger.querySelector('.quest-desc, .project-summary')?.textContent || '';
    const meta = trigger.getAttribute('data-meta') || 'Sertifikat Terverifikasi';

    openModal(title, imgSrc, desc, meta);
  });
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeModal();
  }
});

// Smooth scroll for nav links & button clicks
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        SFX.click();
        targetElement.scrollIntoView({ behavior: 'smooth' });

        if (navMenu && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
        }
      }
    }
  });
});

// Setup hover effects initially
setupCursorHovers();