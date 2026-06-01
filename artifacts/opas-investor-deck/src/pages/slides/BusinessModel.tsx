export default function BusinessModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">06</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Business model
          </span>
        </div>
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[4vh] max-w-[70vw]">
          Three aligned revenue streams
        </h2>

        <div className="grid grid-cols-3 gap-[2.2vw] mb-[5vh]">
          <div className="border-t-[0.3vw] border-gold pt-[2vh]">
            <div className="font-display text-gold text-[3vw] leading-none mb-[1.2vh]">7%</div>
            <h3 className="font-display text-[1.9vw] leading-tight mb-[0.8vh]">Trade fee</h3>
            <p className="font-body text-[1.4vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Charged on every secondary-market transaction across the platform.
            </p>
          </div>
          <div className="border-t-[0.3vw] border-teal pt-[2vh]">
            <div className="font-display text-teal text-[3vw] leading-none mb-[1.2vh]">Margin</div>
            <h3 className="font-display text-[1.9vw] leading-tight mb-[0.8vh]">Management</h3>
            <p className="font-body text-[1.4vw] text-fg/80 leading-snug [text-wrap:pretty]">
              A management margin on rental and charter income across the asset
              book.
            </p>
          </div>
          <div className="border-t-[0.3vw] border-gold pt-[2vh]">
            <div className="font-display text-gold text-[3vw] leading-none mb-[1.2vh]">Spread</div>
            <h3 className="font-display text-[1.9vw] leading-tight mb-[0.8vh]">Acquisition</h3>
            <p className="font-body text-[1.4vw] text-fg/80 leading-snug [text-wrap:pretty]">
              An onboarding spread when new assets are sourced and brought to the
              platform.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[2.2vw]">
          <div className="border border-dashed border-line rounded-md p-[1.6vw]">
            <p className="font-body uppercase tracking-[0.3em] text-[0.95vw] text-muted mb-[1vh]">
              Assets under management
            </p>
            <p className="font-display text-fg/55 text-[2vw]">[ add AUM ]</p>
          </div>
          <div className="border border-dashed border-line rounded-md p-[1.6vw]">
            <p className="font-body uppercase tracking-[0.3em] text-[0.95vw] text-muted mb-[1vh]">
              Registered investors
            </p>
            <p className="font-display text-fg/55 text-[2vw]">[ add count ]</p>
          </div>
          <div className="border border-dashed border-line rounded-md p-[1.6vw]">
            <p className="font-body uppercase tracking-[0.3em] text-[0.95vw] text-muted mb-[1vh]">
              Run-rate revenue
            </p>
            <p className="font-display text-fg/55 text-[2vw]">[ add revenue ]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
