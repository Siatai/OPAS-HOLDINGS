import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type GroupCtx = {
  report: (id: string, ratio: number) => void;
  release: (id: string) => void;
  scale: number;
};

const FitGroup = createContext<GroupCtx | null>(null);

/**
 * Wrap a row/grid of value <FitText share /> tiles so they all render at ONE
 * shared scale — the size the widest value needs — instead of each shrinking on
 * its own. This keeps a row of figures visually even (e.g. "$480M", "120",
 * "18K" all the same size). Only instances with the `share` prop participate, so
 * labels can live inside the same group without affecting the values' scale.
 */
export function FitTextGroup({ children }: { children: ReactNode }) {
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const report = useCallback((id: string, r: number) => {
    setRatios((prev) => (prev[id] === r ? prev : { ...prev, [id]: r }));
  }, []);

  const release = useCallback((id: string) => {
    setRatios((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const vals = Object.values(ratios);
  const scale = vals.length ? Math.min(1, ...vals) : 1;

  const ctx = useMemo<GroupCtx>(() => ({ report, release, scale }), [report, release, scale]);

  return <FitGroup.Provider value={ctx}>{children}</FitGroup.Provider>;
}

type FitTextProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  align?: "left" | "center";
  min?: number;
  /** Participate in the surrounding <FitTextGroup> shared scale. */
  share?: boolean;
};

/**
 * Shrinks its text on a single line so it always fits the container width —
 * never clips, never marquees — and keeps the (scaled) text vertically centred
 * within its box. CSS transforms don't change `offsetWidth`, so we read the
 * inner span's natural (unscaled) width and apply a `scale()` to make it fit.
 * Re-measures on resize and after the wide display fonts swap in.
 */
export default function FitText({
  children,
  className,
  style,
  title,
  align = "left",
  min = 0.5,
  share = false,
}: FitTextProps) {
  const group = useContext(FitGroup);
  const grouped = share && !!group;
  const id = useId();
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [localScale, setLocalScale] = useState(1);

  // Read the group through a ref so the measuring effect never re-subscribes when
  // the shared scale changes — only its identity changes, and depending on it
  // directly would make cleanup release()/report() loop forever.
  const groupRef = useRef(group);
  groupRef.current = group;

  useEffect(() => {
    let raf = 0;
    let mounted = true;

    const measure = () => {
      const c = containerRef.current;
      const m = measureRef.current;
      if (!c || !m) return;
      const cw = c.clientWidth;
      const nw = m.offsetWidth; // layout width — unaffected by the transform
      if (cw === 0 || nw === 0) return;
      const ratio = nw > cw ? Math.max(min, cw / nw) : 1;
      if (grouped) groupRef.current!.report(id, ratio);
      else setLocalScale(ratio);
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

    const fontsApi = typeof document !== "undefined" ? document.fonts : undefined;
    const onFontsDone = () => {
      if (mounted) schedule();
    };

    if (fontsApi) {
      fontsApi.ready.then(() => {
        if (mounted) schedule();
      });
      fontsApi.addEventListener?.("loadingdone", onFontsDone);
    }

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      fontsApi?.removeEventListener?.("loadingdone", onFontsDone);
      if (grouped) groupRef.current!.release(id);
    };
  }, [min, grouped, id]);

  const scale = grouped ? group!.scale : localScale;

  return (
    <span
      ref={containerRef}
      className={`flex w-full max-w-full min-w-0 items-center overflow-hidden ${align === "center" ? "justify-center" : "justify-start"} ${className ?? ""}`}
      style={style}
      title={title}
    >
      <span
        ref={measureRef}
        className="inline-block whitespace-nowrap will-change-transform"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: align === "center" ? "center" : "left center",
        }}
      >
        {children}
      </span>
    </span>
  );
}
