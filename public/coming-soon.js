// coming-soon.js

// Mouse cursor effect
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateCursor() {
  cursorX += (mouseX - cursorX) * 0.1;
  cursorY += (mouseY - cursorY) * 0.1;
  cursorGlow.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Eclipse Canvas Animation
const canvas = document.getElementById('eclipseCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Eclipse animation variables
let sunX = canvas.width / 2;
let sunY = canvas.height / 2;
let sunRadius = Math.min(canvas.width, canvas.height) * 0.25;
let moonProgress = 0;
let moonRadius = sunRadius * 0.95;
let particles = [];
let flashOpacity = 0;

// Create particles
function createParticles() {
  particles = [];
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#ffaa00' : '#ff6600'
    });
  }
}
createParticles();

// Flash effect
function triggerFlash() {
  flashOpacity = 1;
  setTimeout(() => {
    flashOpacity = 0;
  }, 100);
}

// Random flash interval
setInterval(() => {
  if (Math.random() > 0.8) {
    triggerFlash();
  }
}, 3000);

// Draw eclipse
function drawEclipse() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 100; i++) {
    const x = (i * 37) % canvas.width;
    const y = (i * 73) % canvas.height;
    const size = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.3;
    ctx.fillRect(x, y, size, size);
  }
  
  // Draw particles
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    
    p.x += p.speedX;
    p.y += p.speedY;
    
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });
  
  ctx.globalAlpha = 1;
  
  // Draw flash overlay
  if (flashOpacity > 0) {
    ctx.fillStyle = `rgba(255, 200, 100, ${flashOpacity * 0.3})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw sun corona
  const coronaGradient = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.8, sunX, sunY, sunRadius * 1.5);
  coronaGradient.addColorStop(0, 'rgba(255, 170, 0, 0)');
  coronaGradient.addColorStop(1, 'rgba(255, 153, 0, 0.4)');
  ctx.fillStyle = coronaGradient;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw sun
  const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
  sunGradient.addColorStop(0, '#ffdd00');
  sunGradient.addColorStop(0.7, '#ff9900');
  sunGradient.addColorStop(1, '#ff6600');
  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw moon (eclipse)
  const moonX = sunX + Math.sin(moonProgress * Math.PI * 2) * sunRadius * 0.3;
  ctx.fillStyle = '#0a0a23';
  ctx.beginPath();
  ctx.arc(moonX, sunY, moonRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Moon craters
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + moonProgress * Math.PI;
    const craterX = moonX + Math.cos(angle) * moonRadius * 0.3;
    const craterY = sunY + Math.sin(angle) * moonRadius * 0.3;
    const craterSize = 5 + i * 2;
    ctx.beginPath();
    ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Animate moon
  moonProgress += 0.0002;
  if (moonProgress > 1) moonProgress = 0;
}

// Animation loop
function animate() {
  drawEclipse();
  requestAnimationFrame(animate);
}
animate();

// Countdown Timer
const countdownTarget = new Date('July 1, 2026 00:00:00 GMT+0200').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownTarget - now;
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  
  // Pulse effect on seconds change
  const countdownNumbers = document.querySelectorAll('.countdown-number');
  countdownNumbers.forEach(num => {
    num.style.transform = 'scale(1.1)';
    setTimeout(() => {
      num.style.transform = 'scale(1)';
    }, 200);
  });
}

setInterval(updateCountdown, 1000);
updateCountdown();

// CTA Button click
const ctaButton = document.getElementById('ctaButton');
const btnText = document.querySelector('.btn-text');

ctaButton.addEventListener('click', () => {
  ctaButton.style.pointerEvents = 'none';
  
  // Create glitch effect
  const glitchOverlay = document.createElement('div');
  glitchOverlay.className = 'glitch-overlay';
  document.body.appendChild(glitchOverlay);
  
  gsap.to(glitchOverlay, {
    opacity: 0.8,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    onComplete: () => {
      glitchOverlay.remove();
      
      // Reveal the date
      btnText.style.opacity = '0';
      document.querySelector('.btn-reveal').style.opacity = '1';
      document.querySelector('.btn-reveal').style.transform = 'translate(-50%, -50%) scale(1.2)';
      
      setTimeout(() => {
        gsap.to('.btn-reveal', {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }, 100);
    }
  });
});

// Secret message random appearance
const secretMessage = document.getElementById('secretMessage');
function showSecretMessage() {
  if (Math.random() > 0.95) {
    secretMessage.style.animation = 'none';
    secretMessage.offsetHeight;
    secretMessage.style.animation = null;
    setTimeout(showSecretMessage, Math.random() * 10000 + 5000);
  } else {
    setTimeout(showSecretMessage, Math.random() * 10000 + 10000);
  }
}
showSecretMessage();

// Sound toggle
const soundToggle = document.getElementById('soundToggle');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let gainNode = null;
let soundOn = false;

function createBassSound() {
  if (!oscillator) {
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 60;
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
  }
  
  // Create low-frequency eclipse sound
  gsap.to(gainNode.gain, {
    value: soundOn ? 0.1 : 0,
    duration: 0.5
  });
}

soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggle.innerHTML = soundOn ? '<span class="sound-icon">🔉</span>' : '<span class="sound-icon">🔊</span>';
  
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  createBassSound();
});

// Parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  
  gsap.to('.scene', {
    x: x * 0.5,
    y: y * 0.5,
    duration: 1
  });
  
  gsap.to('.content', {
    x: -x * 0.2,
    y: -y * 0.2,
    duration: 1
  });
});

// Initialize GSAP animations
gsap.from('.small-text', {
  opacity: 0,
  y: 30,
  duration: 1,
  ease: 'power3.out'
});

gsap.from('.main-title', {
  opacity: 0,
  y: 50,
  duration: 1.5,
  delay: 0.2,
  ease: 'power3.out'
});

gsap.from('.subtitle', {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.5,
  ease: 'power3.out'
});

gsap.from('.countdown', {
  opacity: 0,
  y: 40,
  duration: 1,
  delay: 0.8,
  ease: 'power3.out'
});

gsap.from('.cta-button', {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 1,
  ease: 'power3.out'
});