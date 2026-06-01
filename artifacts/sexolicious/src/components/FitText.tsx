import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type FitTextProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  align?: "left" | "center";
  min?: number;
};

/**
 * Shrinks its text on a single line so it always fits the container width —
 * never clips, never marquees. CSS transforms don't change `offsetWidth`, so we
 * read the inner span's natural (unscaled) width and apply a `scale()` to make
 * it fit. Re-measures on resize and after the wide display fonts swap in.
 */
export default function FitText({
  children,
  className,
  style,
  title,
  align = "left",
  min = 0.5,
}: FitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      const c = containerRef.current;
      const m = measureRef.current;
      if (!c || !m) return;
      const cw = c.clientWidth;
      const nw = m.offsetWidth; // layout width — unaffected by the transform
      if (cw === 0 || nw === 0) return;
      setScale(nw > cw ? Math.max(min, cw / nw) : 1);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    schedule();

    // One ResizeObserver per instance — no global window/font listeners. The
    // container fires on viewport/layout resize; the measure span fires when the
    // wide display fonts swap in (transforms don't affect its layout box, so this
    // never loops). A couple of startup timers cover the very first font paint.
    const ro = new ResizeObserver(schedule);
    if (containerRef.current) ro.observe(containerRef.current);
    if (measureRef.current) ro.observe(measureRef.current);

    const timers = [120, 400, 1000].map((d) => window.setTimeout(measure, d));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [min]);

  return (
    <span
      ref={containerRef}
      className={`block overflow-hidden ${align === "center" ? "text-center" : ""} ${className ?? ""}`}
      style={style}
      title={title}
    >
      <span
        ref={measureRef}
        className="inline-block whitespace-nowrap align-top will-change-transform"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: align === "center" ? "top center" : "top left",
        }}
      >
        {children}
      </span>
    </span>
  );
}
