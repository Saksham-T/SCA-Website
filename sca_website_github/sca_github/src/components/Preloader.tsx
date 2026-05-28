import { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let currentPct = 0;
    let timer: any;

    const updateCounter = () => {
      let increment = 1;
      if (currentPct < 45) {
        increment = Math.floor(Math.random() * 4) + 4; // fast initial loading
      } else if (currentPct < 85) {
        increment = Math.floor(Math.random() * 2) + 1; // medium progress
      } else {
        increment = Math.floor(Math.random() * 2); // crawl near completion
      }

      currentPct = Math.min(100, currentPct + increment);
      setProgress(currentPct);

      if (currentPct < 100) {
        const delay = currentPct > 80 ? (Math.random() * 70 + 60) : (Math.random() * 30 + 15);
        timer = setTimeout(updateCounter, delay);
      } else {
        // Complete! Slide up preloader and start staggered page reveals
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 1300); // matches the CSS slide-up transition duration
        }, 450);
      }
    };

    timer = setTimeout(updateCounter, 100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`intro-preloader ${isExiting ? 'exit' : ''}`} role="dialog" aria-modal="true" aria-label="Loading Website">
      <div className="preloader-content">
        <h1 className="preloader-monogram">SeeTusk / SCA</h1>
        <div className="preloader-info">
          <span className="preloader-label">Initializing Creative Engine</span>
          <div className="preloader-progress-bar">
            <div className="preloader-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="preloader-counter">
            {(progress < 10 ? '0' : '') + progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
