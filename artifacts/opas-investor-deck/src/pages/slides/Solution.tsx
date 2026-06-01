export default function Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(11,181,190,0.12),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[4vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">02</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            The solution
          </span>
        </div>

        <div className="grid grid-cols-[34%_66%] gap-[4vw] items-center">
          <div>
            <div className="font-display text-gold text-[6vw] leading-[0.85] whitespace-nowrap">
              $100
            </div>
            <p className="font-serif italic text-teal text-[1.9vw] mt-[1.5vh] leading-snug">
              the new minimum ownership interest
            </p>
            <p className="font-body text-[1.4vw] text-fg/75 mt-[3vh] leading-snug [text-wrap:pretty]">
              Opas turns illiquid trophy assets into verifiable, tradeable
              ownership interests.
            </p>
          </div>

          <div className="flex flex-col gap-[3vh]">
            <div className="border-l-[0.3vw] border-gold pl-[2vw]">
              <h3 className="font-display text-[1.8vw] leading-tight mb-[1.2vh]">
                Buy in from $100
              </h3>
              <p className="font-body text-[1.4vw] text-fg/85 leading-snug [text-wrap:pretty]">
                Acquire a co-ownership stake across four asset classes — no
                six-figure cheque required.
              </p>
            </div>
            <div className="border-l-[0.3vw] border-teal pl-[2vw]">
              <h3 className="font-display text-[1.8vw] leading-tight mb-[1.2vh]">
                Earn real yield
              </h3>
              <p className="font-body text-[1.4vw] text-fg/85 leading-snug [text-wrap:pretty]">
                Rental and charter income is distributed pro-rata to every
                ownership interest.
              </p>
            </div>
            <div className="border-l-[0.3vw] border-gold pl-[2vw]">
              <h3 className="font-display text-[1.8vw] leading-tight mb-[1.2vh]">
                Exit any time
              </h3>
              <p className="font-body text-[1.4vw] text-fg/85 leading-snug [text-wrap:pretty]">
                A 24/7 on-chain secondary market replaces a months-long broker
                sale.
              </p>
            </div>
          </div>
        </div>

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
