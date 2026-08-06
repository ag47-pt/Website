"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { faqs } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="The questions worth *asking first*"
        lead="Including the ones a project with something to hide would leave out."
      />

      <div className="mt-14 border-t border-[var(--agi-line)]">
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          const panelId = `faq-panel-${index}`;
          const buttonId = `faq-button-${index}`;

          return (
            <div key={faq.q} className="border-b border-[var(--agi-line)]">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-white"
                >
                  <span className="text-base font-medium tracking-tight sm:text-lg">{faq.q}</span>
                  <Plus
                    aria-hidden
                    className="h-4 w-4 shrink-0 transition-transform duration-300"
                    style={{
                      color: isOpen ? "var(--agi-plum)" : "var(--agi-subtle)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  />
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-6 text-sm leading-relaxed text-[var(--agi-muted)] sm:text-base">
                      {faq.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
