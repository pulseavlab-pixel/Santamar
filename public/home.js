/* =============================================
   SANTAMAR HOME — JavaScript
   Countdown · Navbar · Scroll-reveal · Parallax
   ============================================= */

(function () {
  'use strict';

  /* ── helpers ───────────────────────────── */
  const qs   = (s, ctx = document) => ctx.querySelector(s);
  const qsa  = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  function onReady(fn) {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', fn);
    else
      fn();
  }

  /* ─────────────────────────────────────────
     1. LOADING STATE
  ───────────────────────────────────────── */
  onReady(function () {
    document.body.classList.remove('js-loading');
    document.body.classList.add('js-loaded');
  });

  /* ─────────────────────────────────────────
     2. COUNTDOWN TIMER
  ───────────────────────────────────────── */
  const TARGET = new Date('August 9, 2026 00:00:00 GMT+0200').getTime();

  /* ─────────────────────────────────────────
     2. COUNTDOWN TIMER
     ───────────────────────────────────────── */
  const els = {
    days:   qs('#hDays'),
    hours:  qs('#hHours'),
    mins:   qs('#hMins'),
    secs:   qs('#hSecs'),
  };

  function tick() {
    const now   = Date.now();
    const delta = TARGET - now;

    if (delta <= 0) {
      els.days.textContent  = '00';
      els.hours.textContent = '00';
      els.mins.textContent  = '00';
      els.secs.textContent  = '00';
      return;
    }

    const days    = Math.floor(delta / 86400000);
    const hours   = Math.floor((delta % 86400000) / 3600000);
    const minutes = Math.floor((delta % 3600000)  / 60000);
    const seconds = Math.floor((delta % 60000)    / 1000);

    els.days.textContent  = String(days).padStart(2, '0');
    els.hours.textContent = String(hours).padStart(2, '0');
    els.mins.textContent  = String(minutes).padStart(2, '0');
    els.secs.textContent  = String(seconds).padStart(2, '0');

    /* subtle pulse whenever the seconds change */
    const nums = qsa('.h-count-num');
    nums.forEach(n => {
      n.style.transform = 'scale(1.1)';
      clearTimeout(n._pulseTimer);
      n._pulseTimer = setTimeout(() => { n.style.transform = ''; }, 200);
    });
  }

  setInterval(tick, 1000);
  tick(); /* run immediately so no initial blank flash */

  /* ─────────────────────────────────────────
     3. HOME NAVBAR
     - show on scroll past hero threshold
     - hide on scroll up, show on scroll down
     - add `.is-scrolled` when not at top
  ───────────────────────────────────────── */
  const nav        = qs('#homeNav');
  const burger     = qs('#navToggle');
  const linksPanel = qs('#homeNavLinks');
  let lastScrollY  = 0;
  let heroHidden   = false;

  function handleScroll() {
    const y = window.scrollY;
    const heroH = window.innerHeight * 0.75;

    /* show / hide nav */
    if (y > heroH && !heroHidden) {
      heroHidden = true;
      nav.classList.add('is-visible');
    } else if (y <= heroH && heroHidden) {
      heroHidden = false;
      nav.classList.remove('is-visible');
    }

    /* subtle bg increase when past hero */
    if (y > 60) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScrollY = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── Burger / mobile menu ── */
  function toggleBurger() {
    linksPanel.classList.toggle('is-open');
  }

  if (burger) burger.addEventListener('click', toggleBurger);

  /* close burger when a link is tapped */
  qsa('.hn-link').forEach(link => {
    link.addEventListener('click', function () {
      linksPanel.classList.remove('is-open');
    });
  });

  /* ── Active nav link based on scroll position ── */
  const SECTIONS = ['home', 'intro', 'lineup-prev', 'programa-prev', 'socios', 'contacto'];

  function updateActiveLink() {
    const y        = window.scrollY + window.innerHeight * 0.4;
    let currentId  = 'home';

    for (const id of SECTIONS) {
      const el = qs('#' + id);
      if (!el) continue;
      if (y >= el.offsetTop) currentId = id;
    }

    qsa('.hn-link').forEach(link => {
      link.classList.toggle('active',
        link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ─────────────────────────────────────────
     4. SCROLL-REVEAL  (IntersectionObserver, no
        dependency on GSAP — lighter and
        works even if CDN is lazy-loaded)
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  qsa('.h-section').forEach(sec => revealObserver.observe(sec));

  /* also reveal bottom link when lineup section enters view */
  if (qs('.h-lineup-sec')) {
    const lineupObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -120px 0px' });
    lineupObserver.observe(qs('.h-lineup-sec'));
  }

  /* ─────────────────────────────────────────
     5. HERO PARALLAX  (eclipse scene moves
        subtly with mouse — same feel as
        the sinister coming-soon parallax)
  ───────────────────────────────────────── */
  const eclipseScene = qs('#eclipseScene');
  let   rafPending   = false;
  let   mouseX       = 0;
  let   mouseY       = 0;
  let   curX         = 0;
  let   curY         = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(lerpParallax);
    }
  });

  function lerpParallax() {
    rafPending = false;

    /* Lerp towards target */
    curX += (mouseX - curX) * 0.06;
    curY += (mouseY - curY) * 0.06;

    if (eclipseScene) {
      eclipseScene.style.transform =
        `scale(1.6) translateY(15%) translate(${curX * 12}px, ${curY * 8}px)`;
    }

    /* Kick next frame if input changed */
    if (Math.abs(curX - mouseX) > 0.0005 || Math.abs(curY - mouseY) > 0.0005) {
      rafPending = true;
      requestAnimationFrame(lerpParallax);
    }
  }

  /* ─────────────────────────────────────────
     6. CTA BUTTON — magnetic + glow-follow
  ───────────────────────────────────────── */
  const heroCta = qs('#hCtaBtn');

  if (heroCta) {
    document.addEventListener('mousemove', (e) => {
      const rect  = heroCta.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) * 0.22;
      const dy    = (e.clientY - cy) * 0.22;

      heroCta.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      heroCta.style.setProperty('--mouse-y', `${((e.clientY - rect.top)  / rect.height) * 100}%`);

      /* only move CTA when it's visible on-screen */
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        heroCta.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    });

    document.addEventListener('mouseleave', () => {
      heroCta.style.transform = '';
    });
  }

  /* Also update the .h-socios-card CTA glow while inside viewport */
  qsa('.h-cta-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mouse-x',
        `${Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))}%`);
      btn.style.setProperty('--mouse-y',
        `${Math.max(0, Math.min(100, ((e.clientY - rect.top)  / rect.height) * 100))}%`);
    });
  });

  /* ─────────────────────────────────────────
     7. SMOOTH SCROLL FOR NAV LINKS
  ───────────────────────────────────────── */
  qsa('.home-nav-links a, a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      e.preventDefault();
      const target = qs(href);
      if (!target) return;

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth',
      });
    });
  });

  /* ─────────────────────────────────────────
     8. INIT
  ───────────────────────────────────────── */
  console.log('%c🌾 SANTAMAR HOME — listo', 'color:#ff6600; font-weight:700;');

})();
