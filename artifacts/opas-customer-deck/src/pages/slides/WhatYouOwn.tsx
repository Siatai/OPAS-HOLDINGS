const base = import.meta.env.BASE_URL;

export default function WhatYouOwn() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(234,141,14,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <div className="relative h-full w-full flex flex-col justify-center px-[6vw] py-[7vh]">
        <div className="flex items-center gap-[1.2vw] mb-[2vh]">
          <span className="font-body text-gold text-[1.1vw] tracking-[0.4em]">02</span>
          <span className="font-body uppercase tracking-[0.4em] text-[1.05vw] text-muted">
            What you can own
          </span>
        </div>
        <h2 className="font-display text-[3.2vw] leading-[1] tracking-tight mb-[4vh]">
          Four asset classes, one wallet
        </h2>

        <div className="grid grid-cols-4 gap-[1.6vw]">
          <div className="relative rounded-md overflow-hidden h-[44vh] border border-line">
            <img
              src={`${base}img/london.png`}
              crossOrigin="anonymous"
              alt="Luxury real estate"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,15,0.92),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[1.4vw]">
              <p className="font-display text-[1.5vw] leading-tight">Real estate</p>
              <p className="font-body text-[1vw] text-fg/75 mt-[0.5vh]">
                Prime city homes
              </p>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden h-[44vh] border border-line">
            <img
              src={`${base}img/car_ferrari.png`}
              crossOrigin="anonymous"
              alt="Supercar"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,15,0.92),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[1.4vw]">
              <p className="font-display text-[1.5vw] leading-tight">Supercars</p>
              <p className="font-body text-[1vw] text-fg/75 mt-[0.5vh]">
                Rare collector grade
              </p>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden h-[44vh] border border-line">
            <img
              src={`${base}img/yacht_super.png`}
              crossOrigin="anonymous"
              alt="Superyacht"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,15,0.92),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[1.4vw]">
              <p className="font-display text-[1.5vw] leading-tight">Yachts</p>
              <p className="font-body text-[1vw] text-fg/75 mt-[0.5vh]">
                Charter-ready fleet
              </p>
            </div>
          </div>
          <div className="relative rounded-md overflow-hidden h-[44vh] border border-line">
            <img
              src={`${base}img/jet_gulfstream.png`}
              crossOrigin="anonymous"
              alt="Private jet"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,9,15,0.92),transparent_55%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-[1.4vw]">
              <p className="font-display text-[1.5vw] leading-tight">Private jets</p>
              <p className="font-body text-[1vw] text-fg/75 mt-[0.5vh]">
                Long-range aircraft
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[3vh] left-[6vw] flex items-center gap-[1vw]">
          <div className="h-[1.2vh] w-[1.2vh] bg-gold rotate-45" />
          <span className="font-body uppercase tracking-[0.4em] text-[0.9vw] text-muted">
            Opas Holdings
          </span>
        </div>
      </div>
    </div>
  );
}
