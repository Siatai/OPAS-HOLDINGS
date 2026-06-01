const base = import.meta.env.BASE_URL;

export function SlideHeader({
  section,
  label,
}: {
  section: string;
  label: string;
}) {
  return (
    <div className="absolute top-[4.5vh] left-[8vw] right-[8vw] flex items-center justify-between z-20">
      <div className="flex items-center gap-[1vw]">
        <img
          src={`${base}img/opas-logo.png`}
          crossOrigin="anonymous"
          alt="Opas Holdings logo"
          className="h-[6vh] w-[6vh] object-contain"
        />
        <span className="font-body uppercase tracking-[0.4em] text-[1vw] text-fg/70">
          Opas Holdings
        </span>
      </div>
      <div className="flex items-center gap-[0.9vw]">
        <span className="font-display text-gold text-[1.3vw] leading-none">
          {section}
        </span>
        <span className="font-body uppercase tracking-[0.4em] text-[1vw] text-muted">
          {label}
        </span>
      </div>
    </div>
  );
}

export function SlideFooter({
  page,
  total = "08",
  note = "Strictly private & confidential",
}: {
  page: string;
  total?: string;
  note?: string;
}) {
  return (
    <div className="absolute bottom-[4.5vh] left-[8vw] right-[8vw] flex items-center justify-between z-20">
      <div className="flex items-center gap-[0.8vw]">
        <div className="h-[1vh] w-[1vh] bg-gold rotate-45" />
        <span className="font-body uppercase tracking-[0.35em] text-[0.85vw] text-muted">
          {note}
        </span>
      </div>
      <span className="font-body uppercase tracking-[0.35em] text-[0.85vw] text-muted">
        {page} / {total}
      </span>
    </div>
  );
}
