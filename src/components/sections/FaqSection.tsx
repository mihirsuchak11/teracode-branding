"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqItem } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticHeading } from "@/components/motion/ChromaticLines";

/** The original's indicator: four 2px dots that fan into a wider spread when
 *  the row opens. No chevron. */
function DotsIndicator({ open }: { open: boolean }) {
  return (
    <span className="flex h-6 w-8 shrink-0 items-center justify-center" aria-hidden>
      <span className="relative block h-0.5 w-5">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute top-0 h-0.5 w-0.5 rounded-[1px] bg-fg-muted"
            animate={{ left: open ? i * 6 : i * 4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        ))}
      </span>
    </span>
  );
}

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
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-8 text-left"
      >
        <h3 className="text-[18px] leading-6 font-semibold text-fg">{item.question}</h3>
        <DotsIndicator open={open} />
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
            <p className="pr-8 pb-8 text-[15px] leading-relaxed text-fg-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({
  items,
  title = "Frequently Asked Questions",
  blurb,
}: {
  items: FaqItem[];
  title?: string;
  blurb?: ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="px-6 py-20 md:px-0 md:pt-20 md:pb-44">
      {/* Rows run to the frame edge, so only the left column is padded. */}
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2 md:gap-0 md:pl-10">
        <div className="md:pt-10 md:pr-10">
          <ChromaticHeading
            as="h2"
            className="text-[32px] leading-[34px] font-semibold tracking-tight text-fg"
            text={title}
          />
          <Reveal>
            <p className="mt-6 max-w-[612px] text-[16px] leading-6 text-fg-muted">
              {blurb ?? (
                <>
                  Do you want to learn more about us, let&apos;s go{" "}
                  <Link href="/blog" className="text-fg-dim underline underline-offset-4 hover:text-fg">
                    the blog page
                  </Link>
                  .
                </>
              )}
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
