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
    const measure = () => {
      const c = containerRef.current;
      const m = measureRef.current;
      if (!c || !m) return;
      const overflow = m.scrollWidth - c.clientWidth;
      setShift(overflow > 1 ? m.scrollWidth + gap : 0);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);

    const t = window.setTimeout(measure, 300);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      ro.disconnect();
      window.clearTimeout(t);
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
        <span ref={measureRef} className="whitespace-nowrap shrink-0">
          {children}
        </span>
        {animate && (
          <span aria-hidden className="whitespace-nowrap shrink-0">
            {children}
          </span>
        )}
      </span>
    </span>
  );
}
