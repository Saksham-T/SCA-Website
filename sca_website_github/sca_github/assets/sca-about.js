/* ============================================================
   SCA — ABOUT PAGE REDESIGN JAVASCRIPT
   Scroll Animations, Folds, Count-ups & Magnetic Buttons
   ============================================================ */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(() => {
    initSpotlightGlow();
    initParallaxLayers();
    initClipPathReveal();
    initTimelineProgress();
    initValuesAccordion();
    initOrigamiFolds();
    initMetricCountups();

    initMagneticButton();
  });

  // Spotlight Mouse Glow (Scene 1 Hero)
  function initSpotlightGlow() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mouse-x', `${x}%`);
      hero.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });
  }

  // Floating Parallax Layers (Scene 1 Hero)
  function initParallaxLayers() {
    if (reduceMotion || isTouch) return;

    const hero = document.getElementById('hero');
    const layers = document.querySelectorAll('.floating-layer');
    if (!hero || !layers.length) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer) => {
        const speed = layer.classList.contains('floating-layer-1') ? 30 :
                      layer.classList.contains('floating-layer-2') ? -45 : 15;
        gsap.to(layer, {
          x: x * speed,
          y: y * speed,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      layers.forEach((layer) => {
        gsap.to(layer, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
      });
    });
  }

  // Clip Path Mask Reveal (Scene 2 Intro Image Strip)
  function initClipPathReveal() {
    if (!window.gsap || !window.ScrollTrigger) return;
    if (reduceMotion) {
      gsap.set('.strip-item', { clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo('.strip-item', 
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: '#intro',
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Timeline Connector and Progress (Scene 4)
  function initTimelineProgress() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Timeline line fill
    gsap.fromTo('.timeline-progress',
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 40%',
          end: 'bottom 60%',
          scrub: true
        }
      }
    );

    // Activate items on scroll
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
      });
    });
  }

  // Accordion Expand Click handler (Scene 5 Values)
  function initValuesAccordion() {
    const rows = document.querySelectorAll('.value-row');
    rows.forEach((row) => {
      const toggleRow = () => {
        const isExpanded = row.classList.contains('expanded');
        // Close all other rows
        rows.forEach((r) => {
          r.classList.remove('expanded');
          r.setAttribute('aria-expanded', 'false');
          const icon = r.querySelector('.value-row-icon');
          if (icon) icon.textContent = '[+]';
        });
        if (!isExpanded) {
          row.classList.add('expanded');
          row.setAttribute('aria-expanded', 'true');
          const icon = row.querySelector('.value-row-icon');
          if (icon) icon.textContent = '[-]';
        }
      };

      row.addEventListener('click', toggleRow);

      // Keyboard support
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleRow();
        }
      });
    });
  }

  // Origami Unfold Cards (Scene 6)
  function initOrigamiFolds() {
    const cards = document.querySelectorAll('.origami-card');
    cards.forEach((card) => {
      // Toggle fold on click/hover for tactile feel
      const toggleFold = () => {
        // Fold all other cards back
        cards.forEach((c) => {
          if (c !== card) c.classList.remove('unfolded');
        });
        card.classList.toggle('unfolded');
      };

      card.addEventListener('click', toggleFold);

      // Keyboard support
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFold();
          card.setAttribute('aria-expanded', card.classList.contains('unfolded') ? 'true' : 'false');
        }
      });
    });
  }

  // Slow Count-up Animation for Metrics (Scene 8)
  function initMetricCountups() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const metrics = document.querySelectorAll('.metric-num');
    metrics.forEach((metric) => {
      const targetVal = parseInt(metric.getAttribute('data-target'), 10);
      if (isNaN(targetVal)) return;

      const obj = { val: 0 };

      gsap.fromTo(obj, 
        { val: 0 },
        {
          val: targetVal,
          duration: reduceMotion ? 0.2 : 2.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#credibility',
            start: 'top 80%'
          },
          onUpdate: function () {
            // Check if year or count
            if (targetVal === 2025) {
              metric.textContent = Math.floor(obj.val).toString();
            } else {
              metric.textContent = Math.floor(obj.val).toString();
            }
          }
        }
      );
    });
  }



  // Magnetic Button Animation (Scene 10 Closing Invitation)
  function initMagneticButton() {
    if (isTouch) return;

    const wrap = document.querySelector('.magnetic-btn-wrap');
    const btn = document.querySelector('.magnetic-btn');
    if (!wrap || !btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull: move the button slightly toward the mouse
      gsap.to(btn, {
        x: x * 0.42,
        y: y * 0.42,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }, { passive: true });

    wrap.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  }
})();
