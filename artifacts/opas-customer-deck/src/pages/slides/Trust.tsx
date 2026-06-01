export default function Trust() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">06</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Built on trust
          </span>
        </div>
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          Real assets, verifiable ownership
        </h2>

        <div className="grid grid-cols-3 gap-[2.5vw]">
          <div className="bg-card border border-line rounded-md p-[2vw] h-[40vh] flex flex-col">
            <span className="font-display text-gold text-[2.2vw] leading-none">01</span>
            <h3 className="font-display text-[1.7vw] leading-tight mt-[2.5vh] mb-[2vh]">
              AI valuation
            </h3>
            <p className="font-body text-[1.3vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Every asset is priced and re-marked against live market
              comparables, so you always see a fair number.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[2vw] h-[40vh] flex flex-col">
            <span className="font-display text-gold text-[2.2vw] leading-none">02</span>
            <h3 className="font-display text-[1.7vw] leading-tight mt-[2.5vh] mb-[2vh]">
              On-chain title
            </h3>
            <p className="font-body text-[1.3vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Your ownership interest is recorded on a public ledger — provable,
              transferable, and yours.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[2vw] h-[40vh] flex flex-col">
            <span className="font-display text-gold text-[2.2vw] leading-none">03</span>
            <h3 className="font-display text-[1.7vw] leading-tight mt-[2.5vh] mb-[2vh]">
              Secure custody
            </h3>
            <p className="font-body text-[1.3vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Physical assets are held and insured by regulated partners while
              you hold the digital interest.
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
