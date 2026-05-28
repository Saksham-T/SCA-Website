import * as React from "react";

export interface LogoItem {
  type: "image" | "text";
  src?: string;
  alt?: string;
  text?: string;
  isDarkBg?: boolean;
}

export interface LogoMarqueeProps {
  /** The flat array of logos to display in the marquee */
  logos: LogoItem[];
  /** Scrolling speed duration in seconds (lower is faster). Default: 32 */
  duration?: number;
  /** Pause the scroll animation on hover. Default: true */
  pauseOnHover?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * LogoMarquee is a highly premium brand logo scrolling component featuring:
 * - A seamless infinite scroll animation.
 * - Smooth edge dissolves (gradient mask) blending the scrolling images into the dark layout.
 * - Micro-interactive states including pausing the track and brightening individual items on hover.
 */
export const LogoMarquee = ({
  logos,
  duration = 32,
  pauseOnHover = true,
  className = "",
}: LogoMarqueeProps) => {
  const trackRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className={`marquee marquee--logos ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        WebkitMaskImage: "linear-gradient(to right, transparent, rgba(0,0,0,0.1) 4%, black 15%, black 85%, rgba(0,0,0,0.1) 96%, transparent)",
        maskImage: "linear-gradient(to right, transparent, rgba(0,0,0,0.1) 4%, black 15%, black 85%, rgba(0,0,0,0.1) 96%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        className="marquee-track"
        style={{
          display: "flex",
          width: "max-content",
          animation: `scroll ${duration}s linear infinite`,
          animationPlayState: "running",
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "paused";
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = "running";
          }
        }}
      >
        {/* Render twice for a seamless infinite scroll loop */}
        {Array.from({ length: 2 }).map((_, setIndex) => (
          <React.Fragment key={setIndex}>
            {logos.map((logo, logoIndex) => (
              <span
                key={`${setIndex}-${logoIndex}`}
                className={`marquee-item ${logo.isDarkBg ? "is-dark-bg" : ""}`}
              >
                {logo.type === "image" ? (
                  <img src={logo.src} alt={logo.alt || ""} />
                ) : (
                  <span className="cc-text">{logo.text}</span>
                )}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
