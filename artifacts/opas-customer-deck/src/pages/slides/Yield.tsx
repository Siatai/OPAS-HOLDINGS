const base = import.meta.env.BASE_URL;

export default function Yield() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/yacht_riva.png`}
        crossOrigin="anonymous"
        alt="Yacht on open water"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[linear-gradient(80deg,rgba(7,9,15,0.97)_42%,rgba(7,9,15,0.7))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(11,181,190,0.16),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <div className="flex items-center gap-[1.2vw] mb-[3vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">04</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Real yield
          </span>
        </div>

        <p className="font-serif italic text-teal text-[2.2vw] leading-tight">
          Your assets pay you
        </p>
        <div className="font-display text-gold text-[5.4vw] leading-[0.9] max-w-[70vw] mt-[1.5vh]">
          Income, every month
        </div>
        <p className="font-body text-[1.6vw] text-fg/85 mt-[4vh] max-w-[52vw] leading-snug [text-wrap:pretty]">
          Rent from homes and charter fees from yachts and jets flow straight to
          holders — distributed automatically in proportion to what you own.
        </p>

        <div className="absolute bottom-[6vh] left-[8vw] flex items-center gap-[1vw]">
          <div className="h-[1.2vh] w-[1.2vh] bg-gold rotate-45" />
          <span className="font-body uppercase tracking-[0.4em] text-[0.9vw] text-muted">
            Opas Holdings
          </span>
        </div>
      </div>
    </div>
  );
}
