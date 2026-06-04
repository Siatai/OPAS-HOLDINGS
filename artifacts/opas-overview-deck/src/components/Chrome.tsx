const base = import.meta.env.BASE_URL;

export function SlideHeader({
  section,
  label,
}: {
  section: string;
  label: string;
}) {
  return (
    <div className="absolute top-[4.5vh] left-[8vw] right-[8vw] z-20 flex items-center justify-between">
      <div className="flex items-center gap-[1vw]">
        <div
          className="relative flex h-[6.8vh] w-[6.8vh] items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(234,141,14,0.20) 0%, rgba(234,141,14,0.06) 38%, transparent 72%)",
          }}
        >
          <img
            src={`${base}img/opas-logo.png`}
            crossOrigin="anonymous"
            alt="Opas Holdings logo"
            className="h-[5.9vh] w-[5.9vh] object-contain"
          />
        </div>
        <span className="font-body text-[1vw] uppercase tracking-[0.4em] text-fg/70">
          Opas Holdings
        </span>
      </div>
      <div className="flex items-center gap-[0.9vw]">
        <span className="font-display text-[1.3vw] leading-none text-gold">
          {section}
        </span>
        <span className="font-body text-[1vw] uppercase tracking-[0.4em] text-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={() => window.location.assign("/pitch")}
          className="inline-flex h-[3vw] w-[3vw] min-h-[38px] min-w-[38px] items-center justify-center rounded-full border border-white/14 bg-[rgba(8,12,24,0.84)] text-fg/72 transition-colors hover:border-[rgba(234,141,14,0.45)] hover:text-gold"
          aria-label="Close presentation and return to pitch room"
        >
          <span className="font-display text-[0.95vw] leading-none">X</span>
        </button>
      </div>
    </div>
  );
}

export function SlideFooter({
  page,
  total = "08",
  note = "opasholdings.com",
}: {
  page: string;
  total?: string;
  note?: string;
}) {
  return (
    <div className="absolute bottom-[4.5vh] left-[8vw] right-[8vw] z-20 flex items-center justify-between">
      <div className="flex items-center gap-[0.8vw]">
        <div className="h-[1vh] w-[1vh] rotate-45 bg-gold" />
        <span className="font-body text-[0.85vw] uppercase tracking-[0.35em] text-muted">
          {note}
        </span>
      </div>
      <span className="font-body text-[0.85vw] uppercase tracking-[0.35em] text-muted">
        {page} / {total}
      </span>
    </div>
  );
}
