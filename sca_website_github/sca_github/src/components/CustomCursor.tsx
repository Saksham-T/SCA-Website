import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [textHovered, setTextHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  useEffect(() => {
    // Hide native cursor for screen widths > 900px
    const handleResize = () => {
      setIsHidden(window.innerWidth <= 900);
    };
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const hoverSel = 'a, button, .choice, .vert, .work-item, input, textarea, select, [data-cursor="hover"]';
      const textSel = 'input, textarea';

      if (target.closest && target.closest(hoverSel)) {
        setHovered(true);
      }
      if (target.closest && target.closest(textSel)) {
        setTextHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverSel = 'a, button, .choice, .vert, .work-item, input, textarea, select, [data-cursor="hover"]';
      const textSel = 'input, textarea';

      if (target.closest && target.closest(hoverSel)) {
        setHovered(false);
      }
      if (target.closest && target.closest(textSel)) {
        setTextHovered(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    let animationFrameId: number;
    const tick = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className={`cursor ${hovered ? 'is-hover' : ''} ${textHovered ? 'is-text' : ''}`}
      />
      <div 
        ref={ringRef} 
        className={`cursor-ring ${hovered ? 'is-hover' : ''} ${textHovered ? 'is-text' : ''}`}
      />
    </>
  );
}
