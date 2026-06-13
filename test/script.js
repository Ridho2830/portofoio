// Theme Toggle
const toggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (localStorage.theme === 'light' || (!('theme' in localStorage) && !prefersDark)) {
  document.documentElement.dataset.theme = 'light';
  toggle.textContent = '🌙';
} else {
  toggle.textContent = '☀️';
}

toggle.addEventListener('click', () => {
  if (document.documentElement.hasAttribute('data-theme')) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.theme = 'dark';
    toggle.textContent = '☀️';
  } else {
    document.documentElement.dataset.theme = 'light';
    localStorage.theme = 'light';
    toggle.textContent = '🌙';
  }
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-tag, .work-item, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
    cursor.style.borderColor = '#60A5FA';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.borderColor = '#10B981';
  });
});

// Floating Particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 40; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  const size = Math.random() * 4 + 2;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.animationDuration = Math.random() * 10 + 15 + 's';
  particle.style.animationDelay = Math.random() * 5 + 's';
  particle.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
  particlesContainer.appendChild(particle);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});