/* ============================================================
   SeeTusk — Influencer vertical behaviours
   count-up · spark/chart reveal · scrollytelling · FAQ · rail cue
   Reduced-motion safe.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---- count-up --------------------------------------------- */
  function animateCount(el) {
    var raw = el.getAttribute('data-count');
    var target = parseFloat(raw);
    if (isNaN(target)) return;
    var decimals = (raw.split('.')[1] || '').length;
    if (reduce) { el.textContent = target.toFixed(decimals); return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  var counted = new WeakSet();
  var countObs = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animateCount(e.target);
      }
    });
  }, { threshold: 0.5 }) : null;

  function wireCounts() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (countObs) countObs.observe(el);
      else animateCount(el);
    });
  }

  /* ---- bar / spark reveal ----------------------------------- */
  function revealBars(scope) {
    scope.querySelectorAll('.inf-dash-bars span, .inf-spark span').forEach(function (b, i) {
      var h = parseFloat(b.getAttribute('data-h')) || 0.5;
      if (reduce) { b.style.transform = 'scaleY(' + h + ')'; return; }
      setTimeout(function () { b.style.transform = 'scaleY(' + h + ')'; }, 70 * i);
    });
  }
  function wireBars() {
    document.querySelectorAll('.inf-dash, .inf-live-card').forEach(function (card) {
      if (!hasIO) { revealBars(card); return; }
      var o = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (e) { if (e.isIntersecting) { revealBars(card); obs.disconnect(); } });
      }, { threshold: 0.25 });
      o.observe(card);
    });
  }

  /* ---- scrollytelling: steps drive dashboard regions -------- */
  function initSystem() {
    var steps = Array.prototype.slice.call(document.querySelectorAll('.inf-step'));
    if (!steps.length) return;
    var regions = document.querySelectorAll('.inf-dash-region');
    function lit(key) {
      regions.forEach(function (r) { r.classList.toggle('is-lit', r.getAttribute('data-region') === key); });
    }
    function setActive(idx) {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      var key = steps[idx] && steps[idx].getAttribute('data-lit');
      if (key) lit(key);
    }
    if (reduce || !hasIO) {
      steps.forEach(function (s) { s.classList.add('is-active'); });
      lit('metrics');
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var idx = steps.indexOf(e.target);
          if (idx > -1) setActive(idx);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { obs.observe(s); });
    setActive(0);
  }

  /* ---- inf-rise reveal (hero) ------------------------------- */
  function initRise() {
    var rises = document.querySelectorAll('.inf-rise');
    if (reduce || !hasIO) { rises.forEach(function (r) { r.classList.add('in'); }); return; }
    // hero is above the fold — reveal on next frame
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { rises.forEach(function (r) { r.classList.add('in'); }); });
    });
  }

  /* ---- FAQ accordion ---------------------------------------- */
  function initFaq() {
    var items = document.querySelectorAll('.inf-faq-item');
    items.forEach(function (item) {
      var q = item.querySelector('.inf-faq-q');
      var a = item.querySelector('.inf-faq-a');
      if (!q || !a) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (o) {
          if (o !== item && o.classList.contains('open')) {
            o.classList.remove('open');
            var oa = o.querySelector('.inf-faq-a'), oq = o.querySelector('.inf-faq-q');
            if (oa) oa.style.maxHeight = '0px';
            if (oq) oq.setAttribute('aria-expanded', 'false');
          }
        });
        if (isOpen) {
          item.classList.remove('open'); a.style.maxHeight = '0px'; q.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true');
        }
      });
    });
    window.addEventListener('resize', function () {
      document.querySelectorAll('.inf-faq-item.open .inf-faq-a').forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + 'px';
      });
    });
  }

  /* ---- case rail progress cue ------------------------------- */
  function initRail() {
    var rail = document.querySelector('.inf-rail');
    var fill = document.querySelector('.inf-rail-cue .bar i');
    if (!rail || !fill) return;
    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      var p = max > 0 ? rail.scrollLeft / max : 0;
      fill.style.left = (p * 64) + '%';
    }
    rail.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    initRise();
    wireCounts();
    wireBars();
    initSystem();
    initFaq();
    initRail();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
