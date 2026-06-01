import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function Idea() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(11,181,190,0.12),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="01" label="The idea" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw]">
        <h2 className="font-serif text-[4.2vw] leading-[1.05] max-w-[72vw] [text-wrap:balance]">
          The world's finest assets were built for the few.
          <span className="text-gold italic"> We opened the door.</span>
        </h2>

        <p className="font-body text-[1.6vw] text-fg/80 mt-[5vh] max-w-[58vw] leading-snug [text-wrap:pretty]">
          A penthouse, a Ferrari, a superyacht — assets that earn real income
          but ask for millions up front. Opas splits them into ownership
          interests you can actually buy, hold, and trade.
        </p>
      </div>

      <SlideFooter page="02" note="opasholdings.com" />
    </div>
  );
}
