const base = import.meta.env.BASE_URL;

export default function Title() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/world_skyline.png`}
        crossOrigin="anonymous"
        alt="Global skyline of the world's financial capitals"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,9,15,0.97)_30%,rgba(7,9,15,0.78)_60%,rgba(7,9,15,0.55))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(234,141,14,0.20),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-gold" />

      <div className="relative h-full w-full flex flex-col justify-between px-[8vw] py-[7vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1.1vw]">
            <img
              src={`${base}img/opas-logo.png`}
              crossOrigin="anonymous"
              alt="Opas Holdings logo"
              className="h-[9vh] w-[9vh] object-contain"
            />
            <span className="font-body uppercase tracking-[0.45em] text-[1.15vw] text-fg/80">
              Opas Holdings
            </span>
          </div>
          <span className="font-body uppercase tracking-[0.4em] text-[1vw] text-muted">
            Company Overview — 2026
          </span>
        </div>

        <div className="max-w-[72vw]">
          <p className="font-serif italic text-teal text-[2.6vw] leading-none mb-[3.5vh]">
            Own the world&apos;s finest assets, in co-ownership
          </p>
          <h1 className="font-wordmark text-fg text-[15vw] leading-[0.82] tracking-tight">
            OPAS
          </h1>
          <div className="mt-[2.5vh] h-[0.35vh] w-[22vw] bg-gold/80" />
          <p className="mt-[3vh] font-body text-[2vw] text-fg/90 [text-wrap:balance] max-w-[58vw]">
            A luxury tokenized-asset platform for real estate, supercars, yachts
            &amp; private jets — co-ownership from $100.
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="font-body uppercase tracking-[0.35em] text-[1vw] text-muted">
            AI valuation · Blockchain co-ownership · 24/7 secondary market
          </div>
          <div className="font-body uppercase tracking-[0.3em] text-[0.95vw] text-muted border border-line px-[1.4vw] py-[1vh] rounded-sm">
            opasholdings.com
          </div>
        </div>
      </div>
    </div>
  );
}
