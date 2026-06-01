export default function Idea() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(11,181,190,0.12),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <div className="flex items-center gap-[1.2vw] mb-[4vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">01</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            The idea
          </span>
        </div>

        <h2 className="font-serif text-[4.2vw] leading-[1.05] max-w-[72vw] [text-wrap:balance]">
          The world's finest assets were built for the few.
          <span className="text-gold italic"> We opened the door.</span>
        </h2>

        <p className="font-body text-[1.6vw] text-fg/80 mt-[5vh] max-w-[58vw] leading-snug [text-wrap:pretty]">
          A penthouse, a Ferrari, a superyacht — assets that earn real income
          but ask for millions up front. Opas splits them into ownership
          interests you can actually buy, hold, and trade.
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
