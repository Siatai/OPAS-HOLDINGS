export default function Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_85%,rgba(234,141,14,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">01</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            Why now
          </span>
        </div>
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          Trophy assets stay locked away
        </h2>

        <div className="grid grid-cols-3 gap-[2.5vw]">
          <div className="border-t border-line pt-[2.5vh]">
            <div className="font-display text-gold text-[3.4vw] leading-none mb-[1.5vh]">01</div>
            <p className="font-body text-[1.65vw] leading-snug text-fg/90 [text-wrap:pretty]">
              Six- to nine-figure minimums gate almost everyone out of the
              world&apos;s best assets.
            </p>
          </div>
          <div className="border-t border-line pt-[2.5vh]">
            <div className="font-display text-gold text-[3.4vw] leading-none mb-[1.5vh]">02</div>
            <p className="font-body text-[1.65vw] leading-snug text-fg/90 [text-wrap:pretty]">
              Ownership is illiquid — selling a property or a yacht takes
              months, not minutes.
            </p>
          </div>
          <div className="border-t border-line pt-[2.5vh]">
            <div className="font-display text-gold text-[3.4vw] leading-none mb-[1.5vh]">03</div>
            <p className="font-body text-[1.65vw] leading-snug text-fg/90 [text-wrap:pretty]">
              Yields and provenance are opaque, broker-driven, and hard to
              verify independently.
            </p>
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
