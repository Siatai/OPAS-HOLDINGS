const base = import.meta.env.BASE_URL;

export default function Portfolio() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(234,141,14,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">05</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            The portfolio
          </span>
        </div>
        <h2 className="font-display text-[3.2vw] leading-[1] tracking-tight mb-[4vh]">
          Four asset classes, real yield
        </h2>

        <div className="grid grid-cols-4 gap-[1.8vw]">
          <div className="bg-card border border-line rounded-md overflow-hidden h-[46vh] flex flex-col">
            <img
              src={`${base}img/dubai.png`}
              crossOrigin="anonymous"
              alt="Luxury real estate"
              className="w-full h-[17vh] object-cover"
            />
            <div className="p-[1.3vw] flex flex-col flex-1">
              <h3 className="font-display text-[1.2vw] leading-tight">Real estate</h3>
              <p className="font-body text-[1.1vw] text-fg/70 mt-[0.8vh] leading-snug">
                57 residences · 8 cities
              </p>
              <div className="mt-auto">
                <div className="font-display text-gold text-[1.7vw] leading-none whitespace-nowrap">
                  2.5–8.4%
                </div>
                <p className="font-body text-[0.95vw] text-muted mt-[0.5vh]">net rental yield</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-line rounded-md overflow-hidden h-[46vh] flex flex-col">
            <img
              src={`${base}img/car_ferrari.png`}
              crossOrigin="anonymous"
              alt="Supercar"
              className="w-full h-[17vh] object-cover"
            />
            <div className="p-[1.3vw] flex flex-col flex-1">
              <h3 className="font-display text-[1.2vw] leading-tight">Supercars</h3>
              <p className="font-body text-[1.1vw] text-fg/70 mt-[0.8vh] leading-snug">
                Collectible &amp; charter
              </p>
              <div className="mt-auto">
                <div className="font-display text-gold text-[1.7vw] leading-none whitespace-nowrap">
                  8.6–12.6%
                </div>
                <p className="font-body text-[0.95vw] text-muted mt-[0.5vh]">charter yield</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-line rounded-md overflow-hidden h-[46vh] flex flex-col">
            <img
              src={`${base}img/yacht_super.png`}
              crossOrigin="anonymous"
              alt="Superyacht"
              className="w-full h-[17vh] object-cover"
            />
            <div className="p-[1.3vw] flex flex-col flex-1">
              <h3 className="font-display text-[1.2vw] leading-tight">Yachts</h3>
              <p className="font-body text-[1.1vw] text-fg/70 mt-[0.8vh] leading-snug">
                Crewed charter
              </p>
              <div className="mt-auto">
                <div className="font-display text-gold text-[1.7vw] leading-none whitespace-nowrap">
                  8.2–11.0%
                </div>
                <p className="font-body text-[0.95vw] text-muted mt-[0.5vh]">charter yield</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-line rounded-md overflow-hidden h-[46vh] flex flex-col">
            <img
              src={`${base}img/jet_gulfstream.png`}
              crossOrigin="anonymous"
              alt="Private jet"
              className="w-full h-[17vh] object-cover"
            />
            <div className="p-[1.3vw] flex flex-col flex-1">
              <h3 className="font-display text-[1.2vw] leading-tight">Private jets</h3>
              <p className="font-body text-[1.1vw] text-fg/70 mt-[0.8vh] leading-snug">
                Managed aviation
              </p>
              <div className="mt-auto">
                <div className="font-display text-teal text-[1.7vw] leading-none whitespace-nowrap">
                  Charter
                </div>
                <p className="font-body text-[0.95vw] text-muted mt-[0.5vh]">income split</p>
              </div>
            </div>
          </div>
        </div>

        <p className="font-body text-[0.95vw] text-muted mt-[3vh]">
          Yield ranges from real 2024 market data — Knight Frank, JLL, Savills,
          CBRE.
        </p>
      </div>
    </div>
  );
}
