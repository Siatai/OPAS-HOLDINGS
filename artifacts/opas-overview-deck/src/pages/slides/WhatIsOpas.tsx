import { SlideHeader, SlideFooter } from "@/components/Chrome";

export default function WhatIsOpas() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(11,181,190,0.12),transparent_48%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_88%,rgba(234,141,14,0.12),transparent_45%)]" />
      <div className="absolute top-0 left-0 right-0 h-[0.4vh] bg-line" />

      <SlideHeader section="01" label="What Opas is" />

      <div className="relative h-full w-full flex flex-col justify-center px-[8vw] py-[8vh]">
        <h2 className="font-serif text-[4.4vw] leading-[1.05] max-w-[74vw] [text-wrap:balance]">
          Ownership of the world&apos;s finest assets, opened to
          <span className="text-gold italic"> everyone.</span>
        </h2>

        <p className="font-body text-[1.8vw] text-fg/85 mt-[5vh] max-w-[64vw] leading-snug [text-wrap:pretty]">
          Opas turns trophy assets — prime homes, collector cars, superyachts
          and private jets — into co-ownership stakes you can hold, earn from,
          and trade. What once required millions now starts at $100.
        </p>
      </div>

      <SlideFooter page="02" note="opasholdings.com" />
    </div>
  );
}
