import { steps } from "@/content/home";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";

export function Steps() {
  return (
    <section className="border-y border-border bg-bg-deep">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px px-5 py-14 md:grid-cols-3 md:gap-10">
        {steps.map((step) => (
          <ChromaticReveal key={step.title} className="flex flex-col gap-2 py-4">
            <span className="font-mono text-sm text-brand">{step.n}</span>
            <h3 className="text-xl font-medium text-fg">{step.title}</h3>
            <p className="text-sm leading-relaxed text-fg-muted">{step.body}</p>
          </ChromaticReveal>
        ))}
      </div>
    </section>
  );
}
