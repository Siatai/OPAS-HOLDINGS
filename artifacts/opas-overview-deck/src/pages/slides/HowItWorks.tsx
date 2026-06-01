import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(11,181,190,0.10),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="03" label="How it works" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <h2 className="font-display text-[3.4vw] leading-[1] tracking-tight mb-[5vh] max-w-[70vw]">
          From browse to owner in minutes
        </h2>

        <div className="grid grid-cols-4 gap-[2vw]">
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">01</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Browse
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Explore curated assets with live yield and valuation data.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">02</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Own
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Connect a wallet and acquire an ownership interest from $100.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">03</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Earn
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Receive rental and charter income paid pro-rata.
            </p>
          </div>
          <div className="bg-card border border-line rounded-md p-[1.6vw] h-[38vh] flex flex-col">
            <span className="font-display text-gold text-[2.4vw] leading-none">04</span>
            <h3 className="font-display text-[1.5vw] leading-tight mt-[2vh] mb-[1.5vh]">
              Trade
            </h3>
            <p className="font-body text-[1.2vw] text-fg/80 leading-snug [text-wrap:pretty]">
              Sell your ownership interest any time on the 24/7 secondary market.
            </p>
          </div>
        </div>
      </div>

      <SlideFooter page="04" note="opasholdings.com" />
    </div>
  );
}
