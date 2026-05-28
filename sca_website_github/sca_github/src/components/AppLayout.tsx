import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import AmbientBackground from './AmbientBackground';
import Preloader from './Preloader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showPreloader, setShowPreloader] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top on route changes
    window.scrollTo(0, 0);

    // intersection observer trigger for scroll reveals
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // dynamic query observe
    const timer = setTimeout(() => {
      document.querySelectorAll('.sr, .sr-stag').forEach((el) => io.observe(el));
    }, 150);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('sca_preloaded_v2');
    if (!hasLoaded) {
      setShowPreloader(true);
    } else {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }
  }, []);

  const handlePreloaderExitStart = () => {
    setIsLoaded(true);
    document.body.classList.add('loaded');
  };

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('sca_preloaded_v2', 'true');
    setShowPreloader(false);
  };

  return (
    <>
      <CustomCursor />
      <AmbientBackground />
      {showPreloader && (
        <Preloader 
          onComplete={handlePreloaderComplete} 
          onExitStart={handlePreloaderExitStart} 
        />
      )}
      
      <div className={`main-site-container ${isLoaded ? 'loaded-sweep' : ''}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
