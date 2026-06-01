export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">04</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            How it works
          </span>
        </div>
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          One protocol, end to end
        </h2>

        <div className="grid grid-cols-4 gap-[2vw]">
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">01</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Valuation
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              An AI engine prices every asset against live market comparables.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">02</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Ownership
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Title is structured into verifiable ownership interests on-chain.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">03</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Income
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Rental and charter yield is paid pro-rata to every holder.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">04</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Liquidity
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Holders trade in and out 24/7 on the Opas secondary market.
            </p>
          </div>
        </div>

        <div className="absolute bottom-[5vh] left-[8vw] flex items-center gap-[1vw]">
          <div className="h-[1.2vh] w-[1.2vh] bg-gold rotate-45" />
          <span className="font-body uppercase tracking-[0.4em] text-[0.9vw] text-muted">
            Opas Holdings
          </span>
        </div>
      </div>
    </div>
  );
}
