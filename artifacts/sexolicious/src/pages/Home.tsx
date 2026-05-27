import React from "react";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Properties from "@/components/Properties";
import Stats from "@/components/Stats";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Hero />
      <HowItWorks />
      <Properties />
      <Stats />
      <Benefits />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </div>
  );
}
