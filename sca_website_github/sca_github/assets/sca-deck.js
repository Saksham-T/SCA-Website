/* SCA deck stage — intro pop + spread, then scroll-driven
   fan -> cascade -> scatter, collecting into a deck between each. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  // rise a->b, hold b->c, fall c->d
  const band = (x, a, b, c, d) => Math.min(smooth(a, b, x), 1 - smooth(c, d, x));

  function lerpPose(p1, p2, t) {
    return {
      x: lerp(p1.x, p2.x, t),
      y: lerp(p1.y, p2.y, t),
      r: lerp(p1.r, p2.r, t),
      s: lerp(p1.s, p2.s, t),
      z: lerp(p1.z, p2.z, t)
    };
  }

  function initDeck(deck) {
    const track = deck.querySelector('.deck-track');
    const cards = Array.from(deck.querySelectorAll('.dcard'));
    const copies = Array.from(deck.querySelectorAll('.deck-copy'));
    const pills = Array.from(deck.querySelectorAll('.deck-pill'));
    const dots = Array.from(deck.querySelectorAll('.deck-dots i'));
    const hint = deck.querySelector('.deck-hint');
    if (!track || !cards.length) return;

    const N = cards.length;
    const c = (N - 1) / 2;
    const centerIndex = Math.round(c);
    const perRow = Math.ceil(N / 2);

    // deterministic jitter for the scatter arrangement
    const jit = [
      [-22, -14, -9], [20, 16, 8], [-14, 20, -12], [16, -18, 11],
      [-20, 8, -7], [18, -12, 9], [-10, 18, -11], [12, -8, 7]
    ];

    let u = 1;
    let isMobile = false;
    function setUnit() {
      const vw = window.innerWidth, vh = window.innerHeight;
      u = clamp(Math.min(vw / 1440, vh / 820), 0.5, 1);
      isMobile = vw <= 760;
    }

    // ---- arrangements (untis = px at u=1, centred on stage middle) ----
    function fanPose(i) {
      const d = i - c;
      if (isMobile) {
        return { x: d * 45, y: 60 + d * d * 4, r: d * 5, s: 0.9, z: i };
      }
      return { x: d * 150, y: 138 + d * d * 11, r: d * 7, s: 1, z: i };
    }
    function cascadePose(i) {
      const d = i - c;
      if (isMobile) {
        return { x: d * 16, y: 60 + d * 36, r: -5 + i * 2, s: 0.9, z: i };
      }
      return { x: 165 + d * 76, y: d * 60, r: -7 + i * 2.4, s: 1, z: i };
    }
    function scatterPose(i) {
      if (isMobile) {
        const mobPos = [
          { x: -160, y: -140, r: -12, s: 0.85 },
          { x: 160, y: -120, r: 8, s: 0.85 },
          { x: -200, y: 30, r: 15, s: 0.85 },
          { x: 0, y: 0, r: -5, s: 0.9 },
          { x: 200, y: 60, r: -10, s: 0.85 },
          { x: -120, y: 220, r: -8, s: 0.85 },
          { x: 120, y: 240, r: 12, s: 0.85 }
        ];
        const pos = mobPos[i] || { x: 0, y: 0, r: 0, s: 0.85 };
        return { x: pos.x, y: pos.y, r: pos.r, s: pos.s, z: i };
      }
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const j = jit[i] || [0, 0, 0];
      return {
        x: 250 + (col - (perRow - 1) / 2) * 202 + j[0],
        y: (row - 0.5) * 218 + j[1] * 3.4,
        r: j[2],
        s: 1,
        z: i
      };
    }
    function stackPose(i, shiftY) {
      const d = i - c;
      if (isMobile) {
        return { x: d * 2, y: (shiftY * 0.6) + d * -1.5, r: d * 1.2, s: 0.82, z: i };
      }
      return { x: d * 5, y: shiftY + d * -3, r: d * 2.2, s: 0.92, z: i };
    }
    function introStart(i) {
      const d = i - c;
      if (isMobile) {
        return { x: 0, y: 10, r: d * 1.5, s: 0.6, z: i };
      }
      return { x: 0, y: 26, r: d * 2.2, s: 0.7, z: i };
    }

    // pose along scroll progress p (0..1), with a deck-collect midpoint
    function poseAt(i, p) {
      if (p <= 0.5) {
        const t = p / 0.5;
        const from = fanPose(i), to = cascadePose(i), st = stackPose(i, 28);
        return t < 0.5
          ? lerpPose(from, st, easeInOut(t / 0.5))
          : lerpPose(st, to, easeInOut((t - 0.5) / 0.5));
      }
      const t = (p - 0.5) / 0.5;
      const from = cascadePose(i), to = scatterPose(i), st = stackPose(i, 8);
      return t < 0.5
        ? lerpPose(from, st, easeInOut(t / 0.5))
        : lerpPose(st, to, easeInOut((t - 0.5) / 0.5));
    }

    function applyCard(card, i, p, introT) {
      let pose, op;
      if (introT >= 1) {
        pose = poseAt(i, p);
        op = 1;
      } else {
        const e = easeOutCubic(introT);
        pose = lerpPose(introStart(i), poseAt(i, 0), e);
        op = i === centerIndex
          ? clamp(introT / 0.26, 0, 1)
          : clamp((introT - 0.30) / 0.5, 0, 1);
      }
      const x = pose.x * u, y = pose.y * u;
      card.style.transform =
        `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) rotate(${pose.r.toFixed(2)}deg) scale(${pose.s.toFixed(3)})`;
      card.style.opacity = op.toFixed(3);
      card.style.zIndex = String(10 + Math.round(pose.z));
    }

    function render(p, introT) {
      for (let i = 0; i < N; i++) applyCard(cards[i], i, p, introT);

      const introCopy = clamp((introT - 0.35) / 0.5, 0, 1);
      const aOp = (1 - smooth(0.05, 0.17, p)) * introCopy;
      const bOp = band(p, 0.40, 0.50, 0.60, 0.70);
      const cOp = smooth(0.82, 0.93, p);
      const ops = [aOp, bOp, cOp];

      copies.forEach((el) => {
        const idx = Number(el.getAttribute('data-deck-copy')) || 0;
        const o = ops[idx] != null ? ops[idx] : 0;
        el.style.opacity = o.toFixed(3);
        const lift = (1 - o) * 26;
        const base = el.dataset.baseTransform || '';
        el.style.transform = `${base} translateY(${lift.toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      });

      pills.forEach((el) => { el.style.opacity = (aOp * 0.96).toFixed(3); });

      if (hint) hint.style.opacity = ((1 - smooth(0.02, 0.12, p)) * introCopy).toFixed(3);

      if (dots.length) {
        const active = p < 0.28 ? 0 : (p < 0.78 ? 1 : 2);
        dots.forEach((d, i) => d.classList.toggle('on', i === active));
      }
    }

    // capture each copy layer's CSS transform as a base (so translateY adds to it)
    copies.forEach((el) => {
      const t = getComputedStyle(el).transform;
      el.dataset.baseTransform = t && t !== 'none' ? t : '';
    });

    function progress() {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-rect.top / total, 0, 1);
    }

    setUnit();
    deck.classList.add('is-ready');

    if (reduceMotion) {
      // static: show the fan with the hero copy, no pinning
      cards.forEach((card, i) => {
        const pose = fanPose(i);
        card.style.transform =
          `translate(calc(-50% + ${pose.x * u}px), calc(-50% + ${pose.y * u}px)) rotate(${pose.r}deg)`;
        card.style.opacity = '1';
        card.style.zIndex = String(10 + i);
      });
      copies.forEach((el) => {
        el.style.opacity = Number(el.getAttribute('data-deck-copy')) === 0 ? '1' : '0';
      });
      pills.forEach((el) => (el.style.opacity = '1'));
      return;
    }

    let introT = 0;
    let introStartTime = null;
    let introDone = false;
    const INTRO_MS = 1500;
    let ticking = false;

    function getP() {
      if (typeof window.__deckForceP === 'number') return clamp(window.__deckForceP, 0, 1);
      return introDone ? progress() : 0;
    }

    function draw() {
      render(getP(), introT);
      ticking = false;
    }
    function requestDraw() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    }

    function introFrame(ts) {
      if (introStartTime === null) introStartTime = ts;
      introT = clamp((ts - introStartTime) / INTRO_MS, 0, 1);
      render(0, introT);
      if (introT < 1) requestAnimationFrame(introFrame);
      else { introT = 1; introDone = true; render(progress(), 1); }
    }

    function finishIntroNow() {
      if (introDone) return;
      introT = 1;
      introDone = true;
      render(progress(), 1);
    }

    window.addEventListener('scroll', () => {
      if (!introDone) {
        if (window.scrollY > 12) finishIntroNow();
        return;
      }
      requestDraw();
    }, { passive: true });

    window.addEventListener('resize', () => {
      setUnit();
      requestDraw();
    });

    // start the intro on first paint
    render(0, 0);
    requestAnimationFrame(introFrame);
  }

  function boot() {
    document.querySelectorAll('[data-deck]').forEach(initDeck);
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
