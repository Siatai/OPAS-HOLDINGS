import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function Liquidity() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(234,141,14,0.12),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="05" label="Liquidity" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <div className="grid grid-cols-[42%_58%] gap-[5vw] items-center">
          <div>
            <div className="font-display text-teal text-[7vw] leading-[0.85] whitespace-nowrap">
              24 / 7
            </div>
            <p className="font-serif italic text-gold text-[2vw] mt-[1.5vh] leading-snug">
              no broker, no waiting
            </p>
          </div>

          <div className="flex flex-col gap-[3vh]">
            <h2 className="font-display text-[2.6vw] leading-tight">
              Exit on your terms
            </h2>
            <p className="font-body text-[1.5vw] text-fg/85 leading-snug [text-wrap:pretty]">
              Selling a home or a yacht usually takes months and heavy fees. On
              Opas, your ownership interest trades on an open secondary market
              whenever you choose.
            </p>
            <p className="font-body text-[1.5vw] text-fg/85 leading-snug [text-wrap:pretty]">
              Hold for the income, or move on in a few taps — the choice stays
              yours.
            </p>
          </div>
        </div>
      </div>

      <SlideFooter page="06" note="opasholdings.com" />
    </div>
  );
}
