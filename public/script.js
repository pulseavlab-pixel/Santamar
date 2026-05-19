// script.js

// Smooth scroll effect future ready
// Countdown handled by initCountdown() below; removed duplicate timer to avoid errors on pages without countdown elements.

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});


// Navbar background on scroll

// Safe navbar background on scroll (works if element exists)
const navbarEl = document.querySelector('.navbar') || document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (!navbarEl) return;
  if (window.scrollY > 50) {
    navbarEl.style.background = 'rgba(0,0,0,0.8)';
  } else {
    navbarEl.style.background = 'rgba(0,0,0,0.4)';
  }
});

// Countdown timer (single interval)
;(function initCountdown(){
  const targetDate = new Date('August 1, 2026 20:00:00').getTime();

  function update() {
    const now = Date.now();
    const distance = targetDate - now;
    if (distance < 0) return;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

// Contact form handling for contacto.html
;(function contactForm(){
  const form = document.querySelector('.contact-box form');
  if (!form) return;

  function showMessage(text, isError){
    let msg = form.querySelector('.form-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-msg';
      msg.style.marginTop = '8px';
      msg.style.fontWeight = '700';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.color = isError ? '#ff6b6b' : '#00c16a';
  }

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = form.querySelector('input[type="text"]')?.value.trim() || '';
    const email = form.querySelector('input[type="email"]')?.value.trim() || '';
    const subject = form.querySelectorAll('input[type="text"]')[1]?.value.trim() || '';
    const message = form.querySelector('textarea')?.value.trim() || '';

    if (!name) { showMessage('Por favor indica tu nombre.', true); return; }
    if (!email || !validateEmail(email)) { showMessage('Introduce un email válido.', true); return; }
    if (!message) { showMessage('Escribe tu mensaje.', true); return; }

    // Simulate async submit
    showMessage('Enviando...', false);
    setTimeout(() => {
      showMessage('Mensaje enviado. Gracias — te contestamos pronto.', false);
      form.reset();
    }, 900);
  });
})();

// Eclipse movement effect for CTA
;(function initEclipseEffect(){
  const cta = document.querySelector('.cta');
  if (!cta) return;
  let angle = 0;

  function animate() {
    angle += 0.02;
    const x = 14 + Math.sin(angle) * 18;
    const y = 12 + Math.cos(angle * 0.8) * 10;
    cta.style.setProperty('--eclipse-x', `${x}%`);
    cta.style.setProperty('--eclipse-y', `${y}%`);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();