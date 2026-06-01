const base = import.meta.env.BASE_URL;

export default function Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <img
        src={`${base}img/world_skyline.png`}
        crossOrigin="anonymous"
        alt="Global skyline"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[linear-gradient(75deg,rgba(7,9,15,0.96)_35%,rgba(7,9,15,0.65))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(234,141,14,0.20),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-gold" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <p className="font-body uppercase tracking-[0.45em] text-[1.05vw] text-teal mb-[3vh]">
          Start from $100
        </p>
        <h2 className="font-serif text-[4.6vw] leading-[1.02] max-w-[64vw] [text-wrap:balance]">
          The extraordinary is now
          <span className="text-gold italic"> within reach.</span>
        </h2>

        <div className="absolute bottom-[6vh] left-[8vw] right-[8vw] flex items-end justify-between">
          <div className="font-wordmark text-fg text-[4vw] leading-none">OPAS</div>
          <div className="text-right font-body text-[1.2vw] text-fg/80">
            <p>opasholdings.com</p>
            <p className="text-muted">Own the world&apos;s finest assets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
