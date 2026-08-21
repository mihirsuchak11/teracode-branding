import Image from "next/image";
import { testimonial } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ChevronDown } from "@/components/ui/icons";

export function Testimonial() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      {/* Full-bleed portrait fading into black */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block">
        <Image
          src={testimonial.image}
          alt={`Portrait of ${testimonial.name}`}
          fill
          sizes="42vw"
          className="object-cover object-top [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
      </div>

      <div className="relative px-6 py-20 md:px-10 md:pb-20 md:pt-56">
        <Reveal>
          <p className="text-display-cta text-fg">{testimonial.stat.value}</p>
          <p className="mt-4 text-base text-fg-muted">{testimonial.stat.label}</p>
        </Reveal>

        <div className="mt-12 h-px w-full max-w-[540px] bg-border md:ml-[230px]" />

        <Reveal className="mt-12 max-w-[770px]">
          <blockquote className="ml-auto max-w-[540px] text-right text-lg leading-relaxed text-fg-soft md:text-xl">
            {testimonial.quote}
          </blockquote>
          <div className="mt-9 text-right">
            <p className="text-[15px] font-medium text-fg">{testimonial.name}</p>
            <p className="mt-1 text-[13px] text-fg-muted">{testimonial.role}</p>
          </div>
        </Reveal>

        {/* Carousel arrows (single testimonial in the scrape) */}
        <div className="mt-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg-disabled">
            <ChevronDown width={14} height={14} className="rotate-90" />
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-fg-dim">
            <ChevronDown width={14} height={14} className="-rotate-90" />
          </span>
        </div>
      </div>
    </section>
  );
}
