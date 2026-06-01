import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type MarqueeTextProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  speed?: number;
  gap?: number;
};

/**
 * Auto-scrolls (marquees) its text horizontally ONLY when it overflows its
 * container; otherwise renders static. Renders span elements throughout so it
 * is valid phrasing content inside headings, links and spans. The root span is
 * `display:block` so it fills the available width (needed for overflow
 * detection). Font/colour cascade from the parent.
 *
 * Measurement uses getBoundingClientRect() because the inner measure span is
 * inline content — scrollWidth/clientWidth are unreliable (return 0) on inline
 * elements. We also re-measure after web fonts finish loading (the wide display
 * fonts swap in well after first paint and change the text width).
 */
export default function MarqueeText({
  children,
  className,
  style,
  title,
  speed = 45,
  gap = 56,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      const c = containerRef.current;
      const m = measureRef.current;
      if (!c || !m) return;
      const containerWidth = c.clientWidth;
      const contentWidth = m.getBoundingClientRect().width;
      if (containerWidth === 0 || contentWidth === 0) return;
      const overflow = contentWidth - containerWidth;
      setShift(overflow > 1 ? Math.ceil(contentWidth) + gap : 0);
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    scheduleMeasure();

    const ro = new ResizeObserver(scheduleMeasure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);

    // Re-measure at a few intervals to catch late layout/font swaps.
    const timers = [60, 200, 500, 1200].map((d) => window.setTimeout(measure, d));

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(scheduleMeasure).catch(() => {});
      document.fonts.addEventListener("loadingdone", scheduleMeasure);
    }
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.removeEventListener("loadingdone", scheduleMeasure);
      }
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [children, gap]);

  const animate = shift > 0;
  const duration = animate ? shift / speed : 0;

  return (
    <span ref={containerRef} className={`block overflow-hidden ${className ?? ""}`} style={style} title={title}>
      <span
        className={animate ? "marquee-track inline-flex w-max" : "block"}
        style={
          animate
            ? ({
                animationDuration: `${duration}s`,
                gap: `${gap}px`,
                ["--marquee-shift" as string]: `${shift}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <span ref={measureRef} className="inline-block whitespace-nowrap shrink-0">
          {children}
        </span>
        {animate && (
          <span aria-hidden className="inline-block whitespace-nowrap shrink-0">
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
