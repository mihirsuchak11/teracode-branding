import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";

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
  return (
    <section className="border-y border-border">
      <div className="px-6 pt-16 md:px-10 md:pt-20">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-brand">{eyebrow}</p>
        )}
        <ChromaticLines
          as="h2"
          className="mt-4 max-w-[640px] text-h2-section"
          segments={[
            ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
            { text: title, className: "text-fg" },
          ]}
        />
      </div>
      <div className="grid gap-10 px-6 py-14 md:grid-cols-3 md:px-10 md:pb-20">
        {steps.map((step, i) => (
          <ChromaticReveal key={step.title} delay={0.08 * i}>
            <p className="font-mono text-sm text-brand">{step.n}</p>
            <h3 className="mt-3 text-xl font-semibold leading-6 text-fg">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-fg-muted">{step.body}</p>
          </ChromaticReveal>
        ))}
      </div>
    </section>
  );
}
