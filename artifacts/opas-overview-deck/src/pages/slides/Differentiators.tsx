import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function Differentiators() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="05" label="What sets Opas apart" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[64vw]">
          Built for trust and liquidity
        </h2>

        <div className="grid grid-cols-3 gap-[2vw]">
          <div className="bg-card border border-line rounded-md p-[1.8vw] h-[40vh] flex flex-col">
            <span className="font-display text-gold text-[2.2vw] leading-none">AI</span>
            <h3 className="font-display text-[1.6vw] leading-tight mt-[2.5vh] mb-[1.5vh]">
              Honest valuations
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              An AI engine prices every asset against live market comparables —
              no inflated listings, no guesswork.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.8vw] h-[40vh] flex flex-col">
            <span className="font-display text-teal text-[2.2vw] leading-none">On-chain</span>
            <h3 className="font-display text-[1.6vw] leading-tight mt-[2.5vh] mb-[1.5vh]">
              Real ownership
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Each ownership interest is recorded on-chain — transparent, verifiable, and
              yours to hold or transfer.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.8vw] h-[40vh] flex flex-col">
            <span className="font-display text-gold text-[2.2vw] leading-none">24/7</span>
            <h3 className="font-display text-[1.6vw] leading-tight mt-[2.5vh] mb-[1.5vh]">
              Always liquid
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              A secondary market lets you exit in a few taps, instead of the
              months a private sale demands.
            </p>
          </div>
        </div>
      </div>

      <SlideFooter page="06" note="opasholdings.com" />
    </div>
  );
}
