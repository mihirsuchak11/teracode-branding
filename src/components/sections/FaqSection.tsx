"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticHeading } from "@/components/motion/ChromaticLines";
import { ChevronDown } from "@/components/ui/icons";

function AccordionItem({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border first:border-t">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <h3 className="text-lg font-semibold leading-6 text-fg">{item.question}</h3>
        <ChevronDown
          width={15}
          height={15}
          className={`shrink-0 text-fg-faint transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-[15px] leading-relaxed text-fg-muted">{item.answer}</p>
            {/* answer */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="px-6 py-20 md:px-10 md:pb-44 md:pt-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <ChromaticHeading
            as="h2"
            className="text-h2-section max-w-[340px] text-fg"
            text="Frequently Asked Questions"
          />
          <Reveal>
            <p className="mt-4 max-w-[360px] text-[15px] text-fg-muted">
              Do you want to learn more about us, let&apos;s go{" "}
              <Link href="/blog" className="text-fg-dim underline underline-offset-4 hover:text-fg">
                the blog page
              </Link>
              .
            </p>
          </Reveal>
        </div>
        <Reveal>
          {items.map((item, i) => (
            <AccordionItem
              key={item.question}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
