const base = import.meta.env.BASE_URL;

export default function Ask() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/world_skyline.png`}
        crossOrigin="anonymous"
        alt="Global skyline"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-[linear-gradient(75deg,rgba(7,9,15,0.97)_38%,rgba(7,9,15,0.72))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(234,141,14,0.18),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-gold" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[3vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">07</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            The ask
          </span>
        </div>

        <div className="grid grid-cols-[44%_56%] gap-[5vw] items-center">
          <div>
            <p className="font-serif italic text-teal text-[2vw] mb-[1.5vh]">
              We are raising
            </p>
            <div className="font-display text-gold text-[5vw] leading-[0.85] whitespace-nowrap border-b-[0.25vw] border-dashed border-gold/50 pb-[1.5vh] inline-block">
              $X.X M
            </div>
            <p className="font-body text-[1.4vw] text-fg/85 mt-[3vh] leading-snug [text-wrap:pretty]">
              at a target valuation of{" "}
              <span className="text-fg border-b border-dashed border-muted">
                [ add valuation ]
              </span>{" "}
              to scale acquisitions and the secondary market.
            </p>
          </div>

          <div>
            <p className="font-body uppercase tracking-[0.35em] text-[1vw] text-muted mb-[2.5vh]">
              Use of funds
            </p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex items-baseline gap-[1.5vw] border-b border-line pb-[1.5vh]">
                <span className="font-display text-gold text-[1.6vw]">01</span>
                <span className="font-body text-[1.5vw] text-fg/90">
                  Asset acquisition pipeline
                </span>
              </div>
              <div className="flex items-baseline gap-[1.5vw] border-b border-line pb-[1.5vh]">
                <span className="font-display text-gold text-[1.6vw]">02</span>
                <span className="font-body text-[1.5vw] text-fg/90">
                  Secondary market &amp; product engineering
                </span>
              </div>
              <div className="flex items-baseline gap-[1.5vw] border-b border-line pb-[1.5vh]">
                <span className="font-display text-gold text-[1.6vw]">03</span>
                <span className="font-body text-[1.5vw] text-fg/90">
                  Licensing, compliance &amp; custody
                </span>
              </div>
              <div className="flex items-baseline gap-[1.5vw]">
                <span className="font-display text-gold text-[1.6vw]">04</span>
                <span className="font-body text-[1.5vw] text-fg/90">
                  Investor acquisition &amp; brand
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[6vh] left-[8vw] right-[8vw] flex items-end justify-between">
          <div className="font-wordmark text-fg text-[3.5vw] leading-none">OPAS</div>
          <div className="text-right font-body text-[1.2vw] text-fg/80">
            <p>opasholdings.com</p>
            <p className="text-muted">invest@opasholdings.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
