// SCA shared behavior: cursor labels, studio signal, reveal motion, forms.

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    initCursor();
    initReveals();
    initWordCycle();
    initStudioSignal();
    initParallax();
    initSpotlightNavbar();
    initChoices();
    initForms();
  });

  function initCursor() {
    if (isTouch) return;

    const dot = document.createElement('div');
    dot.className = 'cursor';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    window.addEventListener('mousemove', (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    }, { passive: true });

    function tick() {
      rx += (mx - rx) * 0.17;
      ry += (my - ry) * 0.17;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    }
    tick();

    const hoverSelector = 'a, button,.choice, input, textarea, select, [data-cursor]';
    const textSelector = 'input, textarea';

    document.addEventListener('mouseover', (event) => {
      const target = event.target;
      if (!target.closest) return;
      const hover = target.closest(hoverSelector);
      if (hover) {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
        const label = hover.getAttribute('data-cursor');
        if (label) {
          ring.dataset.label = label;
          ring.classList.add('has-label');
        }
      }
      if (target.closest(textSelector)) {
        dot.classList.add('is-text');
        ring.classList.add('is-text');
      }
    });

    document.addEventListener('mouseout', (event) => {
      const target = event.target;
      if (!target.closest) return;
      if (target.closest(hoverSelector)) {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover', 'has-label');
        ring.dataset.label = '';
      }
      if (target.closest(textSelector)) {
        dot.classList.remove('is-text');
        ring.classList.remove('is-text');
      }
    });
  }

  function initReveals() {
    const revealTargets = document.querySelectorAll('.sr,.sr-stag,.reveal-line');
    if (!revealTargets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealTargets.forEach((el) => observer.observe(el));
  }

  function initWordCycle() {
    const cycle = document.querySelector('[data-cycle]');
    if (!cycle) return;

    const words = (cycle.getAttribute('data-cycle') || '').split('|').filter(Boolean);
    if (!words.length) return;

    let index = 0;
    cycle.textContent = words[index];

    // Measure each word's natural rendered width using an offscreen clone that
    // inherits the cycle's exact typography, so we can animate width on change.
    const measurer = document.createElement('span');
    const cs = window.getComputedStyle(cycle);
    measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:-9999px;pointer-events:none;';
    ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform'].forEach((p) => {
      measurer.style[p] = cs[p];
    });
    document.body.appendChild(measurer);
    const widthOf = (w) => {
      measurer.textContent = w;
      // +0.12em accounts for the blinking caret drawn via ::after
      return measurer.getBoundingClientRect().width + parseFloat(cs.fontSize) * 0.12;
    };

    // Lock in the starting width so the first transition has a value to animate from.
    cycle.style.width = widthOf(words[index]) + 'px';

    if (reduceMotion) return;

    window.setInterval(() => {
      index = (index + 1) % words.length;
      cycle.style.opacity = '0';
      cycle.style.transform = 'translateY(12px)';
      window.setTimeout(() => {
        cycle.textContent = words[index];
        cycle.style.width = widthOf(words[index]) + 'px';
        cycle.style.opacity = '1';
        cycle.style.transform = 'translateY(0)';
      }, 220);
    }, 1850);
  }

  function initStudioSignal() {
    const signal = document.querySelector('[data-studio-signal]');
    if (!signal) return;

    const message = signal.querySelector('[data-signal-message]');
    const time = signal.querySelector('[data-signal-time]');
    const messages = [
      'Editing 12 reels',
      'Creator shortlist ready',
      'Landing page QA in progress',
      'Campaign assets exporting',
      'Shoot deck locked',
      'Strategy deck in review',
      'Visual system updated',
      'New campaign signal detected'
    ];
    let index = 0;

    const setMessage = () => {
      if (!message) return;
      message.style.opacity = '0';
      message.style.transform = 'translateY(8px)';
      window.setTimeout(() => {
        message.textContent = messages[index];
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
        index = (index + 1) % messages.length;
      }, reduceMotion ? 0 : 180);
      if (time) {
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    };

    message.style.transition = 'opacity.24s ease, transform.24s ease';
    setMessage();
    if (!reduceMotion) window.setInterval(setMessage, 2300);
  }

  function initParallax() {
    if (reduceMotion || isTouch) return;

    const hero = document.querySelector('.home-hero');
    const items = document.querySelectorAll('[data-parallax]');
    if (!hero || !items.length) return;

    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      items.forEach((item) => {
        if (item.classList && item.classList.contains('collage-card')) return;
        const strength = Number(item.getAttribute('data-parallax')) || 18;
        item.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
      });
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      items.forEach((item) => {
        item.style.transform = '';
      });
    });

    const scrollItems = document.querySelectorAll('[data-scroll-drift]');
    if (!scrollItems.length) return;

    let ticking = false;
    const drift = () => {
      const viewport = window.innerHeight || 1;
      scrollItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const amount = Number(item.getAttribute('data-scroll-drift')) || 18;
        item.style.setProperty('--drift-y', `${progress * amount}px`);
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(drift);
    }, { passive: true });
    drift();
  }

  function initSpotlightNavbar() {
    const path = location.pathname.split('/').pop() || 'index.html';
    const cleanPath = path.replace(/\.html$/, '');
    const links = document.querySelectorAll('.nav-links a');
    let activeLink = null;

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const cleanHref = href.replace(/\.html$/, '');
      if (cleanHref === cleanPath || (cleanPath === '' && cleanHref === 'index')) {
        link.classList.add('active');
        activeLink = link;
      }
    });

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Append lighting layers
    const spotlight = document.createElement('div');
    spotlight.className = 'nav-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');

    const ambience = document.createElement('div');
    ambience.className = 'nav-ambience';
    ambience.setAttribute('aria-hidden', 'true');

    const borderTrack = document.createElement('div');
    borderTrack.className = 'nav-border-track';
    borderTrack.setAttribute('aria-hidden', 'true');

    navLinks.appendChild(spotlight);
    navLinks.appendChild(ambience);
    navLinks.appendChild(borderTrack);

    // Animation state
    let currentSpotlightX = 0;
    let targetSpotlightX = 0;
    let currentAmbienceX = 0;
    let targetAmbienceX = 0;
    let isMouseOut = true;

    const getLinkCenterX = (linkEl) => {
      if (!linkEl) return 0;
      const navRect = navLinks.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      return linkRect.left - navRect.left + linkRect.width / 2;
    };

    // Initialize positions after layout
    const alignPills = () => {
      if (activeLink) {
        const initialX = getLinkCenterX(activeLink);
        currentAmbienceX = initialX;
        targetAmbienceX = initialX;
        currentSpotlightX = initialX;
        targetSpotlightX = initialX;
        navLinks.style.setProperty('--ambience-x', `${initialX}px`);
        navLinks.style.setProperty('--spotlight-x', `${initialX}px`);
      } else if (links.length > 0) {
        const initialX = getLinkCenterX(links[0]);
        currentAmbienceX = initialX;
        targetAmbienceX = initialX;
        currentSpotlightX = initialX;
        targetSpotlightX = initialX;
        navLinks.style.setProperty('--ambience-x', `${initialX}px`);
        navLinks.style.setProperty('--spotlight-x', `${initialX}px`);
      }
    };

    // Run alignment immediately
    alignPills();
    // Also run after DOM/fonts are likely loaded to handle layout shifts
    window.addEventListener('load', alignPills);

    // Mouse handlers
    navLinks.addEventListener('mousemove', (e) => {
      const rect = navLinks.getBoundingClientRect();
      const x = e.clientX - rect.left;

      isMouseOut = false;
      targetSpotlightX = x;
      currentSpotlightX = x;
      navLinks.style.setProperty('--spotlight-x', `${x}px`);
    });

    navLinks.addEventListener('mouseleave', () => {
      isMouseOut = true;
      if (activeLink) {
        targetSpotlightX = getLinkCenterX(activeLink);
      } else if (links.length > 0) {
        targetSpotlightX = getLinkCenterX(links[0]);
      }
    });

    // Handle clicks to transition state
    links.forEach((link) => {
      link.addEventListener('click', () => {
        links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        activeLink = link;
        targetAmbienceX = getLinkCenterX(link);
      });
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (activeLink) {
        targetAmbienceX = getLinkCenterX(activeLink);
        if (isMouseOut) {
          targetSpotlightX = targetAmbienceX;
        }
      }
    });

    // lerp loop
    const updateLoop = () => {
      currentAmbienceX += (targetAmbienceX - currentAmbienceX) * 0.12;
      navLinks.style.setProperty('--ambience-x', `${currentAmbienceX}px`);

      if (isMouseOut) {
        currentSpotlightX += (targetSpotlightX - currentSpotlightX) * 0.12;
        navLinks.style.setProperty('--spotlight-x', `${currentSpotlightX}px`);
      }

      requestAnimationFrame(updateLoop);
    };

    requestAnimationFrame(updateLoop);
  }

  function initChoices() {
    document.querySelectorAll('[data-choice-group]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const choice = event.target.closest('.choice');
        if (!choice) return;
        group.querySelectorAll('.choice').forEach((item) => item.classList.remove('active'));
        choice.classList.add('active');
        const hidden = group.querySelector('input[type="hidden"]');
        if (hidden) hidden.value = choice.dataset.value || choice.textContent.trim();
      });
    });
  }

  function initForms() {
    document.querySelectorAll('[data-fake-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const get = (name) => {
          const input = form.querySelector(`[name="${name}"]`);
          return input ? (input.value || '').trim() : '';
        };

        const need = get('need') || 'Not selected';
        const budget = get('budget') || 'Not selected';
        const timeline = get('timeline') || 'Not selected';
        const name = get('name');
        const company = get('company');
        const email = get('email');
        const phone = get('phone') || 'Not provided';
        const brief = get('brief');

        if (!name || !company || !email || !brief) {
          alert('Please fill in name, company, email and the situation.');
          return;
        }

        const subject = `New brief - ${company} (${need})`;
        const body = [
          'Hi SCA,',
          '',
          `Need: ${need}`,
          `Budget: ${budget}`,
          `Timeline: ${timeline}`,
          '',
          `Name: ${name}`,
          `Company: ${company}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          '',
          'The situation:',
          brief,
          '',
          'Sent via seetusk.agency'
        ].join('\n');

        window.location.href = 'mailto:contact@seetusk.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(body);

        const button = form.querySelector('button[type="submit"]');
        if (button) {
          button.textContent = 'Opening your mail app';
          button.disabled = true;
          window.setTimeout(() => {
            button.textContent = 'Email did not open? contact@seetusk.com';
          }, 2500);
        }
      });
    });

    document.querySelectorAll('.footer-news form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value.trim() : '';
        if (!email) return;

        window.location.href = 'mailto:contact@seetusk.com'
          + '?subject=' + encodeURIComponent('Newsletter signup')
          + '&body=' + encodeURIComponent(`Please add me to the SCA newsletter.\n\nEmail: ${email}`);

        const button = form.querySelector('button');
        if (button) {
          button.textContent = 'Check your mail app';
          button.disabled = true;
        }
      });
    });
  }

  const cameraStory = document.querySelector('[data-camera-story]');
  if (cameraStory && !reduceMotion) {
    const scene = cameraStory.querySelector('[data-camera-scene]');
    const steps = [...cameraStory.querySelectorAll('[data-camera-step]')];
    const progressBar = cameraStory.querySelector('.camera-progress span');

    const updateCamera = () => {
      const rect = cameraStory.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const activeIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

      steps.forEach((step, index) => step.classList.toggle('active', index === activeIndex));

      if (scene) {
        const yaw = -14 + progress * 28;
        const pitch = 7 - progress * 14;
        const roll = -2 + Math.sin(progress * Math.PI) * 4;
        const lift = Math.sin(progress * Math.PI) * -26;
        scene.style.setProperty('--cam-y', `${yaw}deg`);
        scene.style.setProperty('--cam-x', `${pitch}deg`);
        scene.style.setProperty('--cam-z', `${roll}deg`);
        scene.style.setProperty('--cam-lift', `${lift}px`);
      }

      if (progressBar) progressBar.style.setProperty('--camera-progress', Math.max(.05, progress).toFixed(3));
    };

    updateCamera();
    window.addEventListener('scroll', () => requestAnimationFrame(updateCamera), { passive: true });
    window.addEventListener('resize', updateCamera);
  }
})();
