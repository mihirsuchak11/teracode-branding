import { ctaBand } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";

export function CtaBand() {
  return (
    <section
      className="relative border-t border-border bg-cover bg-center"
      style={{ backgroundImage: "url(/art/cta-burst.png)" }}
    >
      <div className="flex flex-col items-center px-6 py-40 md:py-52">
        <ChromaticCascade
          className="flex flex-col items-center gap-7 text-center"
          blocks={[
            {
              kind: "text",
              tag: "h2",
              className: "text-display-cta text-fg",
              segments: [{ text: `${ctaBand.titleLine1} ${ctaBand.titleLine2}` }],
            },
            {
              kind: "node",
              children: <Button href={ctaBand.primary.href}>{ctaBand.primary.label}</Button>,
            },
          ]}
        />
      </div>
    </section>
  );
}
