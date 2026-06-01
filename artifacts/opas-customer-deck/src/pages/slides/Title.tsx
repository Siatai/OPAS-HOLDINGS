const base = import.meta.env.BASE_URL;

export default function Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/dubai.png`}
        crossOrigin="anonymous"
        alt="Dubai skyline at dusk"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,15,0.96)_30%,rgba(7,9,15,0.55)_70%,rgba(7,9,15,0.35))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(234,141,14,0.20),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-gold" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <p className="font-body uppercase tracking-[0.45em] text-[1.05vw] text-teal mb-[3vh]">
          Opas Holdings
        </p>
        <h1 className="font-wordmark text-fg text-[9vw] leading-[0.9] tracking-tight">
          OPAS
        </h1>
        <p className="font-serif italic text-[3vw] text-gold leading-tight mt-[2vh] max-w-[55vw] [text-wrap:balance]">
          Own a piece of the extraordinary
        </p>
        <p className="font-body text-[1.5vw] text-fg/80 mt-[4vh] max-w-[42vw] leading-snug [text-wrap:pretty]">
          Real estate, supercars, yachts and private jets — held as verifiable
          ownership interests, starting from $100.
        </p>
      </div>

      <div className="absolute bottom-[6vh] left-[8vw] flex items-center gap-[1vw]">
        <div className="h-[1.2vh] w-[1.2vh] bg-gold rotate-45" />
        <span className="font-body uppercase tracking-[0.4em] text-[0.9vw] text-muted">
          How it works
        </span>
      </div>
    </div>
  );
}
