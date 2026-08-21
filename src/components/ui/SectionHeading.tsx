import { ChromaticReveal } from "@/components/motion/ChromaticReveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
}) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <ChromaticReveal className={`flex max-w-2xl flex-col gap-4 ${alignCls}`}>
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-widest text-brand">{eyebrow}</span>
      )}
      <Tag className="text-3xl font-medium tracking-tight text-fg text-balance md:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {body && <p className="text-base leading-relaxed text-fg-muted md:text-lg">{body}</p>}
    </ChromaticReveal>
  );
}
