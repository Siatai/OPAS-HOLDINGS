import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly am I buying?",
    answer: "You are purchasing digital tokens representing a co-ownership equity interest in a Special Purpose Vehicle (SPV) that legally holds title to the underlying asset — whether a prime property, a collectible supercar, a superyacht, or a private jet. These tokens are legally binding instruments giving you direct, proportionate rights to income and capital appreciation — the same rights a traditional owner holds, scaled to your stake."
  },
  {
    question: "How do I receive my income?",
    answer: "Rental and charter income is calculated monthly after deducting management, maintenance, and operating fees. Your net yield is automatically distributed to your connected digital wallet in USDT. No bank transfers, no delays."
  },
  {
    question: "Can I exit my position anytime?",
    answer: "Yes. Unlike traditional real estate, cars, yachts or aircraft — which can take months to transact — our secondary marketplace lets you list and transfer your equity interests 24/7 to other investors at market-determined prices, providing institutional-grade liquidity on a retail-accessible platform."
  },
  {
    question: "Who manages the physical assets?",
    answer: "We partner exclusively with tier-1 operators in each class — property managers, marque-certified car custodians, yacht charter crews, and aircraft management firms. They handle bookings, maintenance, legal compliance, insurance, and tax reporting. As an equity interest holder, you receive returns — never responsibilities."
  },
  {
    question: "What is the minimum investment?",
    answer: "You can acquire an equity interest in a global prime asset from as little as $100 per stake, deployed in the platform's native $OPAS token. Real estate, supercars, yachts and jets that traditionally require $1M+ in capital are now accessible to any accredited investor — or aspiring one — worldwide. Your earnings are then distributed back in USDT."
  },
  {
    question: "How are the assets selected?",
    answer: "Our acquisitions team — backed by proprietary AI valuation models and local market intelligence — screens thousands of assets annually. Only ultra-premium real estate, supercars, yachts and jets with proven demand and capital growth trajectories are admitted to the Opas portfolio."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-black relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-5xl font-display uppercase tracking-wide font-bold text-white mb-2"
          >
            Clarity & <span className="text-primary">Confidence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif italic text-white/70 text-lg sm:text-xl md:text-2xl mb-6"
          >
            Uncompromising Transparency
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10 mb-4 bg-[#0a0a0a] px-4 sm:px-6 rounded-lg data-[state=open]:border-primary/30 transition-colors">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-serif text-base sm:text-lg py-5 sm:py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 leading-relaxed pb-6 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
