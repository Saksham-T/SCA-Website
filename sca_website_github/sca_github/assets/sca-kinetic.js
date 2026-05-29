/* SCA kinetic behaviors (homepage only). Loads AFTER sca.js, which already
   handles the base cursor, .sr reveals, word-cycle, forms, active-nav and the
   3D camera-story. This file adds: intro loader, smooth momentum scrolling,
   magnetic elements, scramble-on-hover, mouse-drift floats, scroll clip-reveals
   and a couple of expressive cursor states. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    initIntro();
    initReveals();
    initMagnetic();
    initScramble();
    initDrift();
    initLab();
    initCursorPlus();
    initSmoothScroll();
  });

  /* ---------- Intro loader (once per visitor) ---------- */
  function initIntro() {
    const intro = document.querySelector('.intro');
    if (!intro) { afterIntro(); return; }

    let seen = null;
    try { seen = localStorage.getItem('sca_intro_v1'); } catch (e) {}

    if (seen || reduce) {
      intro.setAttribute('hidden', '');
      document.body.classList.remove('intro-locked');
      afterIntro();
      return;
    }

    document.body.classList.add('intro-locked');
    requestAnimationFrame(() => intro.classList.add('go'));
    setTimeout(() => intro.classList.add('reveal'), 1000);
    setTimeout(() => {
      intro.classList.add('lift');
      document.body.classList.remove('intro-locked');
      afterIntro();
    }, 2250);
    setTimeout(() => intro.setAttribute('hidden', ''), 3150);

    try { localStorage.setItem('sca_intro_v1', '1'); } catch (e) {}
  }

  // play the hero headline reveal once the curtain is gone
  function afterIntro() {
    document.querySelectorAll('.kin-line').forEach((l) => l.classList.add('in'));
  }

  /* ---------- Scroll clip-reveals (.up / .clip-rise) ---------- */
  function initReveals() {
    const targets = document.querySelectorAll('.up, .clip-rise');
    if (!targets.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    targets.forEach((el) => obs.observe(el));
  }

  /* ---------- Magnetic elements ---------- */
  function initMagnetic() {
    if (reduce || isTouch) return;
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.4;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Scramble text on hover ---------- */
  function initScramble() {
    if (reduce || isTouch) return;
    const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/0123456789';
    document.querySelectorAll('[data-scramble]').forEach((el) => {
      const text = el.textContent;
      el.addEventListener('mouseenter', () => {
        let frame = 0;
        clearInterval(el._scr);
        el._scr = setInterval(() => {
          let out = '';
          for (let i = 0; i < text.length; i++) {
            if (i < frame / 2) out += text[i];
            else if (text[i] === ' ') out += ' ';
            else out += CH[Math.floor(Math.random() * CH.length)];
          }
          el.textContent = out;
          frame++;
          if (frame / 2 >= text.length) { clearInterval(el._scr); el.textContent = text; }
        }, 26);
      });
    });
  }

  /* ---------- Mouse-drift floats (hero shapes + product tiles) ---------- */
  function initDrift() {
    if (reduce || isTouch) return;
    const hero = document.querySelector('.khero');
    if (!hero) return;
    const items = hero.querySelectorAll('[data-depth]');
    if (!items.length) return;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      items.forEach((it) => {
        const d = parseFloat(it.getAttribute('data-depth')) || 18;
        it.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
      });
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      items.forEach((it) => { it.style.transform = ''; });
    });
  }

  /* ---------- Studio-lab floating objects tilt toward cursor ---------- */
  function initLab() {
    if (reduce || isTouch) return;
    document.querySelectorAll('.lab-card').forEach((card) => {
      const obj = card.querySelector('.lab-object');
      if (!obj) return;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        obj.style.transform =
          `translate(${x * 28}px, ${y * 22}px) rotateY(${x * 24}deg) rotateX(${-y * 22}deg)`;
      });
      card.addEventListener('mouseleave', () => { obj.style.transform = ''; });
    });
  }

  /* ---------- Expressive cursor states ---------- */
  function initCursorPlus() {
    if (isTouch) return;
    const setState = (cls, on) => {
      const dot = document.querySelector('.cursor');
      const ring = document.querySelector('.cursor-ring');
      if (dot) dot.classList.toggle(cls, on);
      if (ring) ring.classList.toggle(cls, on);
    };
    document.addEventListener('mousedown', () => setState('is-down', true));
    document.addEventListener('mouseup', () => setState('is-down', false));

    // a "view" cursor on media tiles
    document.querySelectorAll('[data-cursor="View case"], [data-cursor="Open"], .lab-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const ring = document.querySelector('.cursor-ring');
        if (ring) ring.classList.add('is-view');
      });
      el.addEventListener('mouseleave', () => {
        const ring = document.querySelector('.cursor-ring');
        if (ring) ring.classList.remove('is-view');
      });
    });
  }

  /* ---------- Smooth momentum scrolling (whole page eases) ---------- */
  function initSmoothScroll() {
    if (reduce || isTouch || !fine || window.innerWidth < 900) return;

    document.documentElement.style.scrollBehavior = 'auto';
    let target = window.scrollY;
    let current = target;
    let running = false;
    let programmatic = false;
    const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clamp = (v) => Math.max(0, Math.min(maxY(), v));

    function loop() {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      programmatic = true;
      window.scrollTo(0, current);
      programmatic = false;
      if (running) requestAnimationFrame(loop);
    }
    function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return;            // let pinch-zoom through
      if (document.body.classList.contains('intro-locked')) { e.preventDefault(); return; }
      e.preventDefault();
      target = clamp(target + e.deltaY);
      start();
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      const t = e.target;
      const tag = (t && t.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (t && t.isContentEditable)) return;
      const step = window.innerHeight;
      let handled = true;
      switch (e.key) {
        case 'PageDown': target += step * 0.9; break;
        case 'PageUp': target -= step * 0.9; break;
        case 'Home': target = 0; break;
        case 'End': target = maxY(); break;
        case 'ArrowDown': target += 120; break;
        case 'ArrowUp': target -= 120; break;
        case ' ': target += (e.shiftKey ? -1 : 1) * step * 0.9; break;
        default: handled = false;
      }
      if (handled) { e.preventDefault(); target = clamp(target); start(); }
    });

    // resync when the user drags the native scrollbar (not our animation)
    window.addEventListener('scroll', () => {
      if (programmatic || running) return;
      target = current = window.scrollY;
    }, { passive: true });

    // smooth anchor jumps
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        target = clamp(el.getBoundingClientRect().top + window.scrollY - 84);
        start();
      });
    });

    window.addEventListener('resize', () => { target = clamp(target); });
  }
})();
