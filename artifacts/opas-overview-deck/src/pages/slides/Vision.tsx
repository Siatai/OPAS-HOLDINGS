const base = import.meta.env.BASE_URL;

export default function Vision() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/dubai.png`}
        crossOrigin="anonymous"
        alt="Skyline at dusk"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,9,15,0.97)_38%,rgba(7,9,15,0.7))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(234,141,14,0.16),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[3vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">06</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Where we are headed
          </span>
        </div>

        <h2 className="font-serif text-[4.2vw] leading-[1.05] max-w-[64vw] [text-wrap:balance]">
          A single market for every asset worth
          <span className="text-gold italic"> owning.</span>
        </h2>

        <p className="font-body text-[1.7vw] text-fg/85 mt-[5vh] max-w-[58vw] leading-snug [text-wrap:pretty]">
          We are expanding the catalogue, deepening liquidity, and opening access
          across borders — so anyone, anywhere, can hold an ownership interest in the assets
          that define wealth.
        </p>

        <div className="absolute bottom-[6vh] right-[8vw] flex items-center gap-[1vw]">
          <span className="font-body uppercase tracking-[0.4em] text-[0.9vw] text-muted">
            Opas Holdings
          </span>
          <div className="h-[1.2vh] w-[1.2vh] bg-gold rotate-45" />
        </div>
      </div>
    </div>
  );
}
