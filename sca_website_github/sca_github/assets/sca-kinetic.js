/* SCA kinetic behaviors (homepage only). Loads AFTER sca.js, which already
   handles the base cursor, .sr reveals, word-cycle, forms, active-nav and the
   3D camera-story. This file adds: intro loader, native anchor scrolling,
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
    initLenis();
    initReveals();
    initMagnetic();
    initScramble();
    initDrift();
    initLab();
    initCursorPlus();
    initStackingCards();
  });

  /* ---------- Intro loader (plays on every visit) ---------- */
  function initIntro() {
    const intro = document.querySelector('.intro');
    if (!intro) { afterIntro(); return; }

    if (reduce) {
      intro.setAttribute('hidden', '');
      document.body.classList.remove('intro-locked');
      afterIntro();
      return;
    }

    document.body.classList.add('intro-locked');
    // logo lands first, then the vertical SCA zooms in (CSS .95s delay),
    // then the lockup unfurls into the full words.
    requestAnimationFrame(() => intro.classList.add('go'));
    setTimeout(() => intro.classList.add('reveal'), 1950);
    setTimeout(() => {
      intro.classList.add('lift');
      document.body.classList.remove('intro-locked');
      afterIntro();
    }, 3300);
    setTimeout(() => intro.setAttribute('hidden', ''), 4200);
  }

  // play the hero headline reveal once the curtain is gone
  function afterIntro() {
    document.querySelectorAll('.kin-line').forEach((l) => l.classList.add('in'));
  }

  /* ---------- Scroll clip-reveals (.up / .clip-rise) ---------- */
  function initReveals() {
    const targets = Array.from(document.querySelectorAll('.up, .clip-rise'));
    if (!targets.length) return;
    if (reduce) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      try {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        targets.forEach((el) => obs.observe(el));
      } catch (e) {
        targets.forEach((el) => el.classList.add('in'));
      }
      return;
    }

    // GSAP ScrollTrigger reveals
    gsap.utils.toArray('.up').forEach((el) => {
      gsap.fromTo(el, {
        y: 40,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none"
        }
      });
    });

    gsap.utils.toArray('.clip-rise').forEach((el) => {
      const img = el.querySelector('img');
      
      gsap.fromTo(el, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0
      }, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onComplete: () => el.classList.add('in')
      });

      if (img) {
        gsap.fromTo(img, {
          yPercent: -10,
          scale: 1.12
        }, {
          yPercent: 10,
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });
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

  /* ---------- Instant native scrolling (no Lenis momentum lag) ---------- */
  function initLenis() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: 'auto' });
      });
    });
  }

  /* ---------- Stacking & Shuffling Cards with Horizontal Scattering ---------- */
  function initStackingCards() {
    const container = document.querySelector('[data-stacking-cards]');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.project-card'));
    if (!cards.length) return;

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let activeAnimationFrame = null;

    function update() {
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const currentScrollY = window.scrollY;
      
      velocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      cards.forEach((card, i) => {
        const stickyTop = parseInt(window.getComputedStyle(card).top) || (100 + i * 40);
        const cardAbsoluteTop = card.offsetTop;
        const scrollPastSticky = stickyTop - (containerTop + cardAbsoluteTop);

        let progress = 0;
        if (scrollPastSticky > 0) {
          const scrollRange = 500;
          progress = Math.min(1, scrollPastSticky / scrollRange);
        }

        const dir = (i % 2 === 0) ? -1 : 1;
        const maxShift = 28; // max pixels to shift horizontally (scattering)
        const maxRot = 1.8;  // max rotation (scattered fan effect)
        
        const tx = dir * maxShift * progress;
        const rot = dir * maxRot * progress;
        const scale = 1 - (progress * 0.05); // scale down to 0.95
        const opacity = 1 - (progress * 0.12); // opacity down to 0.88

        // Velocity skew for a dynamic horizontal tilt when scrolling fast
        const maxSkew = 4;
        const skewAmount = Math.min(maxSkew, Math.max(-maxSkew, velocity * 0.03));

        card.style.transform = `translateX(${tx}px) scale(${scale}) rotate(${rot}deg) skewX(${skewAmount}deg)`;
        card.style.opacity = opacity;

        if (progress > 0) {
          card.style.boxShadow = `0 ${20 - progress * 8}px ${60 - progress * 24}px rgba(0,0,0,${0.3 + progress * 0.12})`;
        } else {
          card.style.boxShadow = '';
        }
      });
    }

    window.addEventListener('scroll', () => {
      if (!activeAnimationFrame) {
        activeAnimationFrame = requestAnimationFrame(() => {
          update();
          activeAnimationFrame = null;
        });
      }
    }, { passive: true });

    update();

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        let decayInterval = setInterval(() => {
          if (Math.abs(velocity) < 0.15) {
            velocity = 0;
            update();
            clearInterval(decayInterval);
          } else {
            velocity *= 0.65;
            update();
          }
        }, 16);
      }, 100);
    }, { passive: true });
  }
})();
