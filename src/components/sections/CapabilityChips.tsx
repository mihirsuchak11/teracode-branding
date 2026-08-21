import { Reveal } from "@/components/motion/Reveal";
import { ChromaticLines } from "@/components/motion/ChromaticLines";

function ChipIcon({ i }: { i: number }) {
  const shapes = [
    /* chat lines */ <path key="0" d="M4 5h16v11H9l-5 4V5Zm4 4h8M8 12h5" />,
    /* branch */ <path key="1" d="M7 4v10m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm10-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0v1a5 5 0 0 1-5 5h-2" />,
    /* clock rewind */ <path key="2" d="M4 12a8 8 0 1 1 3 6.2M4 12l-1.5-3M4 12l3-1m5-4v5l3.5 2" />,
    /* lightbulb */ <path key="3" d="M9 18h6m-5 3h4m3-12a5 5 0 1 0-8 4c.8.7 1 1.5 1 2h6c0-.5.2-1.3 1-2a5 5 0 0 0 0-4Z" />,
    /* share */ <path key="4" d="M12 15V4m0 0 4 4m-4-4L8 8M5 14v6h14v-6" />,
    /* zap */ <path key="5" d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />,
  ];
  return (
    <svg
      width={19}
      height={19}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[i % shapes.length]}
    </svg>
  );
}

/** Ask mid section: two-tone headline plus a borderless 3-column capability grid. */
export function CapabilityChips({
  title,
  items,
}: {
  title: string;
  items: { title: string; body: string }[];
}) {
  const [first, ...rest] = title.split("\n");
  return (
    <section className="border-b border-border px-6 py-24 md:px-10 md:py-28">
      <ChromaticLines
        as="h2"
        className="text-3xl font-medium leading-[1.25] tracking-tight md:text-[32px]"
        segments={[
          { text: `${first} `, className: "text-fg-muted" },
          { text: rest.join(" "), className: "text-fg" },
        ]}
      />
      <div className="mt-24 grid gap-x-12 gap-y-14 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.05}>
            <div className="flex items-center gap-3 text-fg">
              <span className="text-fg-dim">
                <ChipIcon i={i} />
              </span>
              <h3 className="text-base font-semibold">{item.title}</h3>
            </div>
            <p className="mt-3.5 max-w-[370px] text-sm leading-relaxed text-fg-muted">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
