// SCA — shared behavior
// Custom cursor, scroll reveals, hero type cycler, nav active state.

(function () {
  // ——— Custom cursor ———
  const dot = document.createElement('div');
  dot.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  const hoverSel = 'a, button, .choice, .vert, .work-item, input, textarea, select, [data-cursor="hover"]';
  const textSel = 'input, textarea';
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t.closest && t.closest(hoverSel)) {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    }
    if (t.closest && t.closest(textSel)) {
      dot.classList.add('is-text');
      ring.classList.add('is-text');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t.closest && t.closest(hoverSel)) {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    }
    if (t.closest && t.closest(textSel)) {
      dot.classList.remove('is-text');
      ring.classList.remove('is-text');
    }
  });

  // ——— Scroll reveals ———
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sr, .sr-stag, .reveal').forEach((el) => io.observe(el));

  // ——— Hero word cycler ———
  const cycle = document.querySelector('[data-cycle]');
  if (cycle) {
    const words = (cycle.getAttribute('data-cycle') || '').split('|');
    let i = 0;
    cycle.textContent = words[0];
    setInterval(() => {
      i = (i + 1) % words.length;
      cycle.style.opacity = 0;
      cycle.style.transform = 'translateY(10px)';
      setTimeout(() => {
        cycle.textContent = words[i];
        cycle.style.transition = 'opacity .4s ease, transform .4s ease';
        cycle.style.opacity = 1;
        cycle.style.transform = 'translateY(0)';
      }, 220);
    }, 2200);
    cycle.style.transition = 'opacity .4s ease, transform .4s ease';
    cycle.style.display = 'inline-block';
  }

  // ——— Nav active state ———
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // ——— Choice groups (form radios) ———
  document.querySelectorAll('[data-choice-group]').forEach((g) => {
    g.addEventListener('click', (e) => {
      const t = e.target.closest('.choice');
      if (!t) return;
      g.querySelectorAll('.choice').forEach((c) => c.classList.remove('active'));
      t.classList.add('active');
      const hidden = g.querySelector('input[type="hidden"]');
      if (hidden) hidden.value = t.dataset.value || t.textContent.trim();
    });
  });

  // ——— Form fake submit ———
  document.querySelectorAll('[data-fake-form]').forEach((f) => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = f.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Sent — we’ll be in touch'; btn.disabled = true; btn.style.background = '#266bd9'; btn.style.borderColor = '#266bd9'; btn.style.color = '#fff'; }
    });
  });
})();
