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
    answer: "You are purchasing digital tokens representing fractional ownership in a Special Purpose Vehicle (SPV) that legally owns the physical property. These tokens are legally binding and give you direct rights to the property's rental yield and capital appreciation."
  },
  {
    question: "How do I receive my rental yields?",
    answer: "Rental yields are calculated monthly after deducting property management and maintenance fees. The net yield is automatically distributed to your connected digital wallet in USDC or your preferred stablecoin."
  },
  {
    question: "Can I sell my fraction anytime?",
    answer: "Yes. Unlike traditional real estate which can take months to sell, our secondary marketplace allows you to list and trade your fractions 24/7 with other investors, providing instant liquidity."
  },
  {
    question: "Who manages the physical properties?",
    answer: "We partner with elite, tier-1 property management firms in each local market. They handle everything from tenant screening and maintenance to legal compliance and tax reporting. You never have to deal with a broken pipe."
  },
  {
    question: "Is there a minimum investment?",
    answer: "Yes, you can start building your global real estate portfolio with a minimum investment of just $100 per fraction. This democratizes access to properties that typically require millions in capital."
  },
  {
    question: "How are the properties selected?",
    answer: "Our expert acquisitions team analyzes thousands of properties using proprietary algorithms and local market expertise. We only select ultra-premium properties in high-demand global cities with proven track records of appreciation and yield."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-32 bg-black relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            Clarity & <span className="luxury-gradient-text">Confidence</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-white/10 mb-4 bg-[#0a0a0a] px-6 rounded-lg data-[state=open]:border-primary/30 transition-colors">
                <AccordionTrigger className="text-white hover:text-primary hover:no-underline font-serif text-lg py-6 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 leading-relaxed pb-6">
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
