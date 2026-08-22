import Image from "next/image";
import { testimonial } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";

/**
 * 600px band: a bottom-aligned text column beside a fixed 500×600 portrait.
 * The portrait's fade to black is baked into the PNG, so it needs no mask.
 * Type and rhythm are the original's — stat, label, a right-aligned rule and
 * quote at 20/28, then attribution. There is one quote, so no carousel.
 */
export function Testimonial() {
  return (
    // The page frame (layout.tsx `mx-16`) already supplies the outer inset,
    // so this only pads on small screens.
    <section className="relative border-y border-border px-6 md:px-0">
      <div className="mx-auto flex max-w-[1400px] md:h-[600px]">
        {/* No right padding — the original runs the text to the column edge,
            where the portrait begins. */}
        <div className="flex flex-1 flex-col justify-end py-16 md:py-10 md:pr-0 md:pl-10">
          <ChromaticCascade
            blocks={[
              {
                kind: "text",
                tag: "h2",
                className: "text-display-cta text-fg",
                segments: [{ text: testimonial.stat.value }],
              },
              {
                kind: "text",
                tag: "p",
                className: "mt-3 text-[20px] leading-7 text-fg-muted",
                segments: [{ text: testimonial.stat.label }],
              },
            ]}
          />

          <div className="mt-9 ml-auto h-px w-full max-w-[589px] bg-border" />

          <Reveal>
            <blockquote className="mt-11 ml-auto max-w-[589px] text-right text-[20px] leading-7 text-fg">
              {testimonial.quote}
            </blockquote>

            <div className="mt-10 text-right">
              <p className="text-[16px] leading-6 text-fg">{testimonial.name}</p>
              <p className="mt-1 text-[12px] leading-4 text-fg-muted">{testimonial.role}</p>
            </div>
          </Reveal>
        </div>

        <div className="relative hidden h-[600px] w-[500px] shrink-0 md:block">
          <Image
            src={testimonial.image}
            alt=""
            aria-hidden
            fill
            sizes="500px"
            className="pointer-events-none object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
