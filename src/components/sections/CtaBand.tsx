import { ctaBand } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { StrandBurst } from "@/components/three/StrandBurst";

export function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      {/* Live strand burst, full-bleed behind the copy. Falls back to the
          site's own still (`/art/cta-burst.png`) without WebGL. */}
      <StrandBurst className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* 677px band, headline broken after titleLine1 */}
      <div className="relative flex flex-col items-center justify-center px-6 py-40 md:h-[677px] md:py-0">
        <ChromaticCascade
          className="flex flex-col items-center gap-7 text-center"
          blocks={[
            {
              kind: "text",
              tag: "h2",
              // Hard break after "Your data," — the original breaks there
              // explicitly; no width would produce it, since line 2 is wider.
              className: "text-display-cta max-w-[520px] whitespace-pre-line text-fg",
              segments: [{ text: `${ctaBand.titleLine1}\n${ctaBand.titleLine2}` }],
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
