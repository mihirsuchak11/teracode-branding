"use client";

import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";
import {
  REVIEW_DWELL,
  ReviewFlow,
  useOnScreen,
  useReviewCycle,
} from "@/components/sections/ReviewFlow";

/**
 * Opening band of the Review page, built on the home page's Statement rhythm:
 * a two-tone headline with room above it, a tall live stage, then the three
 * steps. Space separates this from the next section — no rule.
 */
export function HowItWorks({
  eyebrow,
  titleMuted,
  title,
  steps,
}: {
  eyebrow?: string;
  titleMuted?: string;
  title: string;
  steps: { n: string; title: string; body: string }[];
}) {
  const { ref, on } = useOnScreen<HTMLElement>();
  const active = useReviewCycle(!on);

  return (
    <section ref={ref} className="relative">
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <ChromaticCascade
          blocks={[
            ...(eyebrow
              ? [
                  {
                    kind: "text" as const,
                    tag: "p" as const,
                    className: "font-mono text-xs uppercase tracking-widest text-brand",
                    segments: [{ text: eyebrow }],
                  },
                ]
              : []),
            {
              kind: "text",
              tag: "h2",
              className: "mt-5 max-w-[620px] text-h2-statement",
              segments: [
                ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
                { text: title, className: "text-fg" },
              ],
            },
          ]}
        />
      </div>

      <div className="relative pt-10">
        <ReviewFlow active={active} />
      </div>

      <div className="grid gap-12 px-6 pt-16 pb-16 md:grid-cols-3 md:gap-14 md:px-10 md:pt-20 md:pb-24">
        {steps.map((step, i) => (
          <ChromaticReveal key={step.title} delay={0.08 * i}>
            {/* The step on stage carries the brand tint as well as the filling
                rule — the rule alone was too quiet to read as movement. */}
            <div
              className={`relative rounded-xl px-5 pt-5 pb-6 transition-colors duration-500 ${
                i === active ? "bg-brand-soft/15" : "bg-transparent"
              }`}
            >
              <span className="absolute inset-x-5 top-0 h-px bg-border" />
              {i === active && (
                <span
                  key={active}
                  className="review-step-fill pointer-events-none absolute inset-x-5 top-0 h-px bg-brand"
                  style={{ animationDuration: `${REVIEW_DWELL[active]}ms` }}
                />
              )}
              <p
                className={`font-mono text-sm transition-colors duration-300 ${
                  i === active ? "text-brand" : "text-fg-faint"
                }`}
              >
                {step.n}
              </p>
              <h3 className="mt-4 text-xl font-semibold leading-6 text-fg">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-fg-muted">{step.body}</p>
            </div>
          </ChromaticReveal>
        ))}
      </div>
    </section>
  );
}
