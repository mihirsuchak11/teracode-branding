import { statementMock } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticLines } from "@/components/motion/ChromaticLines";

export function Statement() {
  return (
    <section className="relative">
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <ChromaticLines
          as="h2"
          className="text-h2-statement max-w-[620px]"
          segments={[
            {
              text: "Your team wastes hours pulling data from scattered tools. ",
              className: "text-fg-faint",
            },
            { text: "Strand turns that into one conversation.", className: "text-fg" },
          ]}
        />
      </div>

      {/* Floating query mock on wave art */}
      <div className="relative mt-4 flex justify-center px-6 py-32 md:py-40">
        <img
          src="/art/statement-waves.png"
          alt=""
          aria-hidden
          className="art-blend pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <Reveal className="relative z-10 w-full max-w-[460px]">
          <div className="rounded-card border border-border-strong/40 bg-bg-deep/90 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-[15px] text-fg-soft">{statementMock.question}</p>
              <span className="text-xs text-fg-disabled">{statementMock.status}</span>
            </div>
            <div className="border-t border-border px-5 py-4">
              <p className="font-mono text-xs text-fg-faint">
                {statementMock.scoring[0]}
                <span className="text-fg-dim">{statementMock.scoring[1]}</span>
                <span className="text-warn">{statementMock.scoring[2]}</span>
              </p>
              <div className="mt-4 space-y-3">
                {statementMock.rows.map((row) => (
                  <div
                    key={row.name}
                    className={`flex items-center justify-between ${row.dim ? "opacity-35" : ""}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-2 text-[10px] text-fg-faint">
                        ✳
                      </span>
                      <span className="text-sm font-medium text-fg-soft">{row.name}</span>
                      <span className="flex items-center gap-1 text-xs text-danger">
                        <span className="h-1 w-1 rounded-full bg-danger" />
                        {row.risk}
                      </span>
                    </span>
                    <span className="rounded-md bg-danger-soft/50 px-2.5 py-1 text-xs text-danger">
                      {row.pill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-6 text-[13px] text-fg-faint">
            {statementMock.actions.map((a, i) => (
              <span key={a} className="flex items-center gap-6">
                {i > 0 && <span className="text-border-strong">|</span>}
                <span>{a}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
