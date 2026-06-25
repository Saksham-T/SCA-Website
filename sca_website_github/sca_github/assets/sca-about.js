/* ============================================================
   SCA — ABOUT PAGE SPECIFIC REDESIGN SCRIPT
   Handles the slider transitions, counter item updates, and
   automatic rotation of hero images.
   ============================================================ */

(function () {
  let current = 0;
  let intervalId = null;

  function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const counters = document.querySelectorAll('.counter-item');
    if (!slides.length || !counters.length) return;

    // Define goSlide globally on window so HTML inline onclick handlers work
    window.goSlide = function (n) {
      if (n === current) return;
      
      // Reset timer so user clicking doesn't trigger double transitions
      resetTimer();

      slides[current].classList.remove('active');
      counters[current].classList.remove('active');
      current = n;
      slides[current].classList.add('active');
      counters[current].classList.add('active');
    };

    function startTimer() {
      intervalId = setInterval(() => {
        window.goSlide((current + 1) % slides.length);
      }, 5000);
    }

    function resetTimer() {
      if (intervalId) {
        clearInterval(intervalId);
        startTimer();
      }
    }

    // Start auto rotating slides
    startTimer();
  }

  // boot
  if (document.readyState !== 'loading') initSlider();
  else document.addEventListener('DOMContentLoaded', initSlider);
})();
