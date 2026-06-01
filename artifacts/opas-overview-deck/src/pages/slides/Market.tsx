export default function Market() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(234,141,14,0.14),transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">04</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Market opportunity
          </span>
        </div>
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[6vh] max-w-[62vw]">
          A market compounding fast
        </h2>

        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-[2.5vw]">
          <div>
            <div className="font-display text-teal text-[6vw] leading-[0.85] whitespace-nowrap">
              $31B
            </div>
            <p className="font-body text-[1.5vw] text-fg/85 mt-[1.5vh] leading-snug [text-wrap:pretty]">
              tokenized real-world assets on-chain
            </p>
            <p className="font-body text-[1.05vw] text-muted mt-[0.6vh]">Today · 2026</p>
          </div>

          <div className="font-body text-gold text-[3.5vw] leading-none pb-[3vh]">→</div>

          <div>
            <div className="font-display text-gold text-[6vw] leading-[0.85] whitespace-nowrap">
              $5.5T
            </div>
            <p className="font-body text-[1.5vw] text-fg/85 mt-[1.5vh] leading-snug [text-wrap:pretty]">
              projected tokenized asset market
            </p>
            <p className="font-body text-[1.05vw] text-muted mt-[0.6vh]">
              Citi base case · 2030
            </p>
          </div>
        </div>

        <p className="font-body text-[1vw] text-muted mt-[7vh] max-w-[72vw] [text-wrap:pretty]">
          Sources: industry on-chain RWA estimates (2026); Citi GPS tokenization
          base-case projection (2030). Luxury real estate, collectible cars,
          yachts and aviation remain among the largest under-tokenized pools.
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
