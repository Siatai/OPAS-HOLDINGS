import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="04" label="How it works" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          One protocol, end to end
        </h2>

        <div className="grid grid-cols-4 gap-[2vw]">
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">01</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Valuation
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              An AI engine prices every asset against live market comparables.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">02</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Ownership
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Title is structured into verifiable ownership interests on-chain.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">03</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Income
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Rental and charter yield is paid pro-rata to every holder.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">04</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Liquidity
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Holders trade in and out 24/7 on the Opas secondary market.
            </p>
          </div>
        </div>

      </div>

      <SlideFooter page="05" note="Strictly private & confidential" />
    </div>
  );
}
