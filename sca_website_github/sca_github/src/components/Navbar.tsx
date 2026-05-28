import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyles, setPillStyles] = useState<React.CSSProperties>({
    opacity: 0,
    left: 0,
    width: 0,
  });

  const updatePill = () => {
    if (!containerRef.current) return;
    
    // Find either the hovered link OR the active link in the container
    const hoveredLink = containerRef.current.querySelector('a:hover') as HTMLElement;
    const activeLink = containerRef.current.querySelector('a.active') as HTMLElement;
    
    const target = hoveredLink || activeLink;
    
    if (target) {
      setPillStyles({
        left: `${target.offsetLeft}px`,
        width: `${target.offsetWidth}px`,
        opacity: 1,
      });
    } else {
      setPillStyles((prev) => ({
        ...prev,
        opacity: 0,
      }));
    }
  };

  useEffect(() => {
    // Short delay to let DOM active styles render before updating offsets
    const timer = setTimeout(updatePill, 40);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Hook up hover tracking on container
  const handleMouseEnter = () => updatePill();
  const handleMouseMove = () => updatePill();
  const handleMouseLeave = () => {
    const activeLink = containerRef.current?.querySelector('a.active') as HTMLElement;
    if (activeLink) {
      setPillStyles({
        left: `${activeLink.offsetLeft}px`,
        width: `${activeLink.offsetWidth}px`,
        opacity: 1,
      });
    } else {
      setPillStyles((prev) => ({
        ...prev,
        opacity: 0,
      }));
    }
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="SeeTusk Creative Agency. Home">
          <span className="brand-mark">
            <img src="/images/sca-logo-mark.png" alt="SCA Logo" />
          </span>
          <span>SeeTusk / SCA</span>
        </Link>
        
        <div 
          className="nav-links" 
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative' }}
        >
          {/* Spotlight Glowing Line Segment */}
          <div 
            className="nav-spotlight-line"
            style={{
              position: 'absolute',
              bottom: '-1px',
              height: '2px',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(38,107,255,1) 50%, rgba(255,255,255,1) 80%, rgba(255,255,255,0) 100%)',
              boxShadow: '0 0 10px #ffffff, 0 0 20px rgba(38,107,255,0.8)',
              pointerEvents: 'none',
              zIndex: 2,
              transition: 'left 0.28s cubic-bezier(0.25, 1, 0.5, 1), width 0.28s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.2s ease',
              ...pillStyles
            }}
          />

          <NavLink to="/content" style={{ zIndex: 1 }} className={({ isActive }) => isActive ? 'active' : ''}>Content</NavLink>
          <NavLink to="/influencer" style={{ zIndex: 1 }} className={({ isActive }) => isActive ? 'active' : ''}>Influencer</NavLink>
          <NavLink to="/web" style={{ zIndex: 1 }} className={({ isActive }) => isActive ? 'active' : ''}>Web &amp; Tech</NavLink>
          <NavLink to="/about" style={{ zIndex: 1 }} className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        </div>

        <div className="nav-cta">
          <Link to="/contact" className="btn accent">
            Start a project <span className="arr">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
