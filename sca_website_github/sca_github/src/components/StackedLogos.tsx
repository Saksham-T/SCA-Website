import * as React from "react";

export interface StackedLogosProps {
  /** Array of logo groups - each group is an array of React nodes */
  logoGroups: React.ReactNode[][];
  /** Animation duration in seconds. Default: 30 */
  duration?: number;
  /** Stagger factor for animation timing between groups. Default: 0.8 */
  stagger?: number;
  /** Width of each logo container. Default: "220px" */
  logoWidth?: string;
  /** Additional CSS classes */
  className?: string;
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const StackedLogos = ({
  logoGroups,
  duration = 30,
  stagger = 0.8,
  logoWidth = "220px",
  className,
}: StackedLogosProps) => {
  const itemCount = logoGroups[0]?.length || 0;
  const columns = logoGroups.length;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Track mouse position for glow effect
  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !gridRef.current) return;

      const rect = gridRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    },
    []
  );

  const cellHeight = 115; // Increased by 20% (from 96px to 115px)

  return (
    <div
      ref={containerRef}
      className={cn("stacked-logos relative w-auto", className)}
      style={
        {
          "--duration": duration,
          "--items": itemCount,
          "--lists": columns,
          "--stagger": stagger,
          "--logo-width": logoWidth,
          "--cell-height": `${cellHeight}px`,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
    >
      {/* Grid Container */}
      <div
        ref={gridRef}
        className="stacked-logos__grid"
        style={{
          display: "grid",
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gridTemplateColumns: `repeat(${columns}, ${logoWidth})`,
        }}
      >
        {/* Mouse-following glow overlay for background (Electric Blue theme) */}
        <div
          className="stacked-logos__glow"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 10,
            transition: "opacity 0.3s ease",
            background:
              "radial-gradient(500px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(38,107,255,0.06), transparent 70%)",
          }}
        />

        {/* Mouse-following glow for borders - single overlay with gradient (Electric Blue theme) */}
        <div
          className="stacked-logos__border-glow"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            opacity: 0,
            zIndex: 20,
            transition: "opacity 0.3s ease",
            background:
              "radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(38,107,255,0.8), transparent 40%)",
            maskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(${logoWidth} - 1px), black calc(${logoWidth} - 1px), black ${logoWidth}),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(to right, transparent, transparent calc(${logoWidth} - 1px), black calc(${logoWidth} - 1px), black ${logoWidth}),
              linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent calc(100% - 1px), black calc(100% - 1px), black 100%)
            `,
            maskComposite: "add",
            WebkitMaskComposite: "source-over",
          }}
        />

        {/* Left edge glow */}
        <div
          className="stacked-logos__border-glow"
          style={{
            pointerEvents: "none",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "1px",
            opacity: 0,
            zIndex: 20,
            transition: "opacity 0.3s ease",
            background:
              "radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(38,107,255,0.8), transparent 40%)",
          }}
        />

        {/* Logo Groups */}
        {logoGroups.map((logos, groupIndex) => (
          <div
            key={groupIndex}
            className="stacked-logos__cell"
            style={
              {
                "--index": groupIndex,
                display: "grid",
                position: "relative",
                overflow: "hidden",
                height: `${cellHeight}px`,
                gridTemplate: "1fr / 1fr",
              } as React.CSSProperties
            }
          >
            {/* Base border lines - elegant dark grey lines for premium feel */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
            {groupIndex === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "1px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
              />
            )}

            {/* Stacked logos */}
            {logos.map((logo, logoIndex) => (
              <div
                key={logoIndex}
                className="stacked-logos__item"
                style={
                  {
                    "--i": logoIndex,
                    gridColumnStart: 1,
                    gridRowStart: 1,
                    display: "grid",
                    placeItems: "center",
                    padding: "14px 12px",
                  } as React.CSSProperties
                }
              >
                <div className="stacked-logos__logo">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedLogos;
