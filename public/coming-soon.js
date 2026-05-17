/* ============================================
   SANTAMAR - PREMIUM COMING SOON
   Solar Eclipse + Ibiza Nightlife
   JavaScript Animations & Interactions
   ============================================ */

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ============================================
   1. CONFIGURACIÓN INICIAL
   ============================================ */
const dom = {
  body: document.body,
  cursorGlow: document.querySelector('.cursor-glow'),
  sun: document.getElementById('sun'),
  moon: document.getElementById('moon'),
  eclipseScene: document.getElementById('eclipseScene'),
  starsContainer: document.getElementById('stars'),
  particlesContainer: document.getElementById('particles'),
  countdown: {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  },
  ctaBtn: document.getElementById('ctaButton'),
  ctaText: document.querySelector('.cta-text'),
  ctaReveal: document.querySelector('.cta-reveal'),
  soundToggle: document.getElementById('soundToggle'),
  soundIcon: document.querySelector('.sound-icon'),
  soundMuted: document.querySelector('.sound-muted'),
  bgAudio: document.getElementById('bgAudio'),
  secretMessage: document.getElementById('secretMessage'),
  screenOverlay: document.getElementById('screenOverlay')
};

/* ============================================
   2. AUDIO AMBIENTAL (OPCIONAL)
   ============================================ */
let ambientAudio = null;
let isMuted = true;

function initAudio() {
  try {
    const audioEl = dom.bgAudio;
    if (!audioEl) {
      throw new Error('Audio element no encontrado');
    }

    audioEl.volume = 0.15;
    audioEl.muted = true;

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setTimeout(() => {
          audioEl.muted = false;
        }, 100);
        isMuted = false;
        dom.soundIcon.style.display = 'none';
        dom.soundMuted.classList.remove('hidden');
      }).catch(() => {
        isMuted = true;
        dom.soundIcon.style.display = 'block';
        dom.soundMuted.classList.add('hidden');

        const resumePlayback = () => {
          audioEl.muted = false;
          audioEl.play().then(() => {
            isMuted = false;
            dom.soundIcon.style.display = 'none';
            dom.soundMuted.classList.remove('hidden');
            document.body.removeEventListener('click', resumePlayback);
          }).catch(() => {});
        };

        document.body.addEventListener('click', resumePlayback, { once: true });
      });
    }

    ambientAudio = audioEl;
  } catch (e) {
    console.warn('Audio local no soportado', e);
    dom.soundToggle.style.display = 'none';
  }
}

function toggleSound() {
  if (!ambientAudio) {
    initAudio();
    return;
  }

  isMuted = !isMuted;

  if (isMuted) {
    ambientAudio.volume = 0;
    dom.soundIcon.style.display = 'block';
    dom.soundMuted.classList.add('hidden');
  } else {
    ambientAudio.volume = 0.15;
    dom.soundIcon.style.display = 'none';
    dom.soundMuted.classList.remove('hidden');
  }
}

/* ============================================
   3. CURSOR GLOW & PARALLAX MOUSE
   ============================================ */
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2
};

document.addEventListener('mousemove', (e) => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
  
  // Actualizar posición del cursor-glow
  gsap.to(dom.cursorGlow, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.15,
    ease: 'power2.out'
  });
  
  // Parallax en eclipse
  const parallaxX = (e.clientX / window.innerWidth - 0.5) * 20;
  const parallaxY = (e.clientY / window.innerHeight - 0.5) * 20;
  
  gsap.to(dom.eclipseScene, {
    x: parallaxX * 0.3,
    y: parallaxY * 0.3,
    duration: 1,
    ease: 'power2.out'
  });
  
  // Efecto en el sol
  if (dom.sun) {
    gsap.to(dom.sun, {
      x: parallaxX * -0.1,
      y: parallaxY * -0.1,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
  
  // CTA button magnetic effect
  const rect = dom.ctaBtn.getBoundingClientRect();
  const btnX = rect.left + rect.width / 2;
  const btnY = rect.top + rect.height / 2;
  const distX = (e.clientX - btnX) * 0.2;
  const distY = (e.clientY - btnY) * 0.2;
  
  gsap.to(dom.ctaBtn, {
    x: distX,
    y: distY,
    duration: 0.3,
    ease: 'power2.out'
  });
});

// Restablecer posición al salir
document.addEventListener('mouseleave', () => {
  gsap.to(dom.eclipseScene, { x: 0, y: 0, duration: 1 });
  gsap.to(dom.sun, { x: 0, y: 0, duration: 1 });
  gsap.to(dom.ctaBtn, { x: 0, y: 0, duration: 0.3 });
});

/* ============================================
   4. ANIMACIÓN DEL ECLIPSE (MOON OVER SUN)
   ============================================ */
let eclipseProgress = 0;
const eclipseSpeed = 0.00015; // Velocidad muy lenta

function animateEclipse() {
  eclipseProgress += eclipseSpeed;
  if (eclipseProgress > 1) eclipseProgress = 0;
  
  // Calcular posición X de la luna (se mueve de izquierda a derecha sobre el sol)
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  const startX = -minDim * 0.4;
  const endX = minDim * 0.4;
  const currentX = startX + eclipseProgress * (endX - startX);
  
  gsap.set(dom.moon, {
    x: `${currentX}px`,
    y: `-50%`
  });
  
  // Rotación sutil de la luna para simular cráteres
  gsap.set(dom.moon, {
    rotation: eclipseProgress * 5
  });
  
  requestAnimationFrame(animateEclipse);
}

/* ============================================
   5. GENERAR ESTRELLAS
   ============================================ */
function createStars() {
  const starsCount = 150;
  const stars = [];
  
  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      background: white;
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.7 + 0.3};
      animation: starTwinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;
    dom.starsContainer.appendChild(star);
    stars.push(star);
  }
  
  return stars;
}

/* ============================================
   6. PARTÍCULAS CÓSMICAS
   ============================================ */
function createParticles() {
  const particleCount = window.innerWidth < 768 ? 30 : 60;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * 100;
    const startY = 100 + Math.random() * 20;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${startX}%;
      bottom: -20px;
      background: radial-gradient(circle, rgba(255, 170, 0, 0.9) 0%, transparent 70%);
      border-radius: 50%;
      animation: particleFloat ${duration}s linear ${delay}s infinite;
      opacity: 0;
    `;
    
    dom.particlesContainer.appendChild(particle);
  }
}

/* ============================================
   7. CUENTA ATRÁS
   ============================================ */
const targetDate = new Date('July 1, 2026 00:00:00 GMT+0200').getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = targetDate - now;
  
  if (distance <= 0) {
    dom.countdown.days.textContent = '00';
    dom.countdown.hours.textContent = '00';
    dom.countdown.minutes.textContent = '00';
    dom.countdown.seconds.textContent = '00';
    return;
  }
  
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  dom.countdown.days.textContent = String(days).padStart(2, '0');
  dom.countdown.hours.textContent = String(hours).padStart(2, '0');
  dom.countdown.minutes.textContent = String(minutes).padStart(2, '0');
  dom.countdown.seconds.textContent = String(seconds).padStart(2, '0');
  
  // Efecto de pulso en cada número al cambiar
  const numbers = document.querySelectorAll('.count-number');
  numbers.forEach(num => {
    num.style.transform = 'scale(1.1)';
    setTimeout(() => {
      num.style.transform = 'scale(1)';
    }, 200);
  });
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ============================================
   8. BOTÓN CTA CON GLITCH
   ============================================ */
let isGlitchActive = false;

dom.ctaBtn.addEventListener('click', () => {
  if (isGlitchActive) return;
  isGlitchActive = true;
  
  // Desactivar interacción
  dom.ctaBtn.style.pointerEvents = 'none';
  dom.body.classList.add('glitch-active');
  
  // Animación de glitch
  gsap.to(dom.screenOverlay, {
    opacity: 0.6,
    duration: 0.05,
    repeat: 6,
    yoyo: true,
    ease: 'steps(2)',
    onComplete: () => {
      dom.body.classList.remove('glitch-active');
      gsap.to(dom.screenOverlay, { opacity: 0, duration: 0.1 });
      
      // Reveal final
      gsap.to(dom.ctaText, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      gsap.to(dom.ctaReveal, {
        opacity: 1,
        y: '0%',
        scale: 1.15,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
      
      // Flash final
      setTimeout(() => {
        gsap.to(dom.ctaReveal, { scale: 1, duration: 0.3, ease: 'power2.out' });
      }, 150);
      
      isGlitchActive = false;
    }
  });
});

/* ============================================
   9. MENSAJE SECRETO
   ============================================ */
function scheduleSecret() {
  const delay = Math.random() * 15000 + 10000;
  
  setTimeout(() => {
    if (Math.random() > 0.4) {
      dom.secretMessage.style.animation = 'none';
      dom.secretMessage.offsetHeight;
      dom.secretMessage.style.animation = null;
      
      setTimeout(() => {
        dom.secretMessage.style.animation = 'none';
        dom.secretMessage.offsetHeight;
        dom.secretMessage.style.animation = null;
        scheduleSecret();
      }, 2000);
    } else {
      scheduleSecret();
    }
  }, delay);
}

scheduleSecret();

/* ============================================
   10. FLASHES CADA 8–12 SEGUNDOS
   ============================================ */
function scheduleFlash() {
  const delay = Math.random() * 4000 + 8000;
  
  setTimeout(() => {
    gsap.to(dom.screenOverlay, {
      opacity: 0.08,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        scheduleFlash();
      }
    });
  }, delay);
}

scheduleFlash();

/* ============================================
   11. ANIMACIONES DE CARGA (GSAP)
   ============================================ */
function initEntranceAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  
  tl.to('.top-label', {
    opacity: 1,
    y: 0,
    duration: 0.8
  })
  .to('.main-title', {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'expo.out'
  }, '-=0.4')
  .to('.subtitle', {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, '-=0.6')
  .to('.countdown', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'expo.out'
  }, '-=0.4')
  .to('.cta-btn', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'back.out(1.2)'
  }, '-=0.3');
}

/* ============================================
   12. INICIALIZACIÓN
   ============================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Añadir clase para estados JS
  dom.body.classList.add('js-loaded');
  dom.body.classList.remove('js-loading');
  
  // Inicializar subsistemas
  createStars();
  createParticles();
  animateEclipse();
  initEntranceAnimations();
  
  // Intentar iniciar audio en cuanto se carga la web
  initAudio();
  
  // Actualizar posición inicial del cursor-glow
  gsap.set(dom.cursorGlow, { x: mouse.x, y: mouse.y });
  
  console.log('🌘 ECLIPSE IBIZA VIBES - Initialized');
}

/* ============================================
   13. EVENT LISTENERS EXTRAS
   ============================================ */
dom.soundToggle.addEventListener('click', toggleSound);

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    dom.particlesContainer.innerHTML = '';
    createParticles();
  }, 250);
});

/* ============================================
   14. OPTIMIZACIONES DE RENDIMIENTO
   ============================================ */
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
  gsap.globalTimeline.timeScale(1.2);
  
  dom.particlesContainer.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      left: ${Math.random() * 100}%;
      bottom: -20px;
      background: radial-gradient(circle, rgba(255, 170, 0, 0.9) 0%, transparent 70%);
      border-radius: 50%;
      animation: particleFloat ${Math.random() * 15 + 15}s linear infinite;
      opacity: 0;
    `;
    dom.particlesContainer.appendChild(p);
  }
}

/* ============================================
   15. EVENTOS ESPECIALES
   ============================================ */

// Activación de easter egg con tecla 'E'
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'e') {
    dom.secretMessage.style.animation = 'none';
    dom.secretMessage.offsetHeight;
    dom.secretMessage.style.animation = null;
  }
});
