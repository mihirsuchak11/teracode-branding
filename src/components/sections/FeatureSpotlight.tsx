"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { graphSources, pulseAlert, spotlights, hero } from "@/content/home";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChevronDown, Mic, Plus } from "@/components/ui/icons";
import { HeroStrands, type StrandConfig } from "@/components/three/HeroStrands";
import { ASK_RING, PULSE_SCATTER } from "@/components/three/clouds";

// Stable config objects (referential stability keeps the WebGL effect from re-initing).
const ASK_CONFIG: Partial<StrandConfig> = {
  points: ASK_RING,
  threshold: 0.6,
  cameraRotationX: 0,
  cameraRotationY: 0,
  extrudeOffset: { x: 0, y: 0, z: 0.18 },
  strandOpacity: 0.25,
  tipRadius: 0.003,
  dispersion: 0.8,
};
const PULSE_CONFIG: Partial<StrandConfig> = {
  points: PULSE_SCATTER,
  threshold: 0.55,
  cameraRotationX: 0,
  cameraRotationY: 0,
  extrudeOffset: { x: 0, y: 0, z: 0.22 },
  strandOpacity: 0.2,
  tipRadius: 0.003,
  dispersion: 0.8,
};

function MiniGlyph({ i }: { i: number }) {
  const shapes = [
    <path key="a" d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />,
    <path key="b" d="M3 12a9 9 0 0 1 18 0M7 12v4m5-7v7m5-10v10" />,
    <path key="c" d="M4 16c3 0 3-8 6-8s3 8 6 8 3-4 4-4" />,
    <circle key="d" cx="12" cy="12" r="8" />,
    <path key="e" d="M4 12h4l2-5 4 10 2-5h4" />,
    <path key="f" d="M6 4v10a4 4 0 0 0 4 4h8m0 0-3-3m3 3-3 3" />,
  ];
  return (
    <svg
      width={17}
      height={17}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[i % shapes.length]}
    </svg>
  );
}

function ExploreMore({ href }: { href: string }) {
  return (
    <Link href={href} className="group mt-10 inline-flex items-center gap-3 text-[15px] text-fg-dim">
      Explore more
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
        <ChevronDown width={13} height={13} className="-rotate-90 text-fg-muted" />
      </span>
    </Link>
  );
}

/**
 * 01/02/03 progress rail on the frame's right edge — the active feature's
 * number brightens and its tick extends, matching the original "Progress"
 * component that tracks scroll through the pinned section.
 */
function ProgressRail({ active, count }: { active: number; count: number }) {
  return (
    <div className="flex shrink-0 flex-col items-end gap-3 font-mono text-[11px]">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={`transition-colors ${active === i ? "text-fg" : "text-fg-disabled"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className={`h-px transition-all duration-500 ${
              active === i ? "w-6 bg-fg" : "w-2.5 bg-border-strong"
            }`}
          />
        </span>
      ))}
    </div>
  );
}

function CortexMock() {
  const dot: Record<string, string> = {
    Live: "bg-brand",
    Syncing: "bg-warn",
    Pending: "bg-fg-disabled",
  };
  return (
    <div className="w-full max-w-[300px] rounded-card border border-border-strong/40 bg-bg-deep/60">
      {graphSources.map((s, i) => (
        <div
          key={s.name}
          className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
        >
          <div>
            <p className="text-sm font-medium text-fg-soft">{s.name}</p>
            <p className="mt-0.5 font-mono text-[11px] text-fg-faint">{s.detail}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-fg-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${dot[s.status]}`} />
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function AskMock() {
  return (
    <div className="relative flex w-full max-w-[560px] flex-col items-center py-24">
      <HeroStrands
        config={ASK_CONFIG}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-border-strong/50 bg-bg/80 p-5 backdrop-blur-[2px]">
        <p className="text-lg text-fg-faint">{hero.mock.prompt}</p>
        <div className="mt-10 flex items-center justify-between text-fg-faint">
          <Plus width={18} height={18} />
          <Mic width={17} height={17} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {["Analyze", "Compare", "Monitor"].map((chip, i) => (
          <span
            key={chip}
            className="flex items-center gap-2 rounded-lg border border-border-strong/50 bg-bg/80 px-3.5 py-2 text-sm text-fg-dim"
          >
            <span className="text-fg-faint">
              <MiniGlyph i={i + 3} />
            </span>
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function PulseMock() {
  return (
    <div className="relative flex w-full max-w-[600px] items-center justify-center py-24">
      <HeroStrands
        config={PULSE_CONFIG}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2"
      />
      <div className="relative z-10 w-full max-w-[290px] rounded-card border border-border-strong/40 bg-surface/90 shadow-xl shadow-black/40">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-danger-soft/40 px-2.5 py-1 text-xs font-medium text-danger">
              {pulseAlert.severity}
            </span>
            <span className="text-xs text-fg-faint">{pulseAlert.time}</span>
          </div>
          <p className="mt-3.5 text-[15px] font-medium text-fg-soft">{pulseAlert.title}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-fg-muted">{pulseAlert.body}</p>
          <svg viewBox="0 0 260 70" className="mt-4 w-full">
            <polyline
              points="0,28 40,25 80,29 120,24 160,27 200,26 260,22"
              fill="none"
              stroke="#57534e"
              strokeWidth="1.5"
            />
            <polyline
              points="160,27 190,30 210,55 235,38 260,42"
              fill="none"
              stroke="#e5484d"
              strokeWidth="1.5"
            />
            <circle cx="210" cy="55" r="3" fill="#e5484d" />
            <text x="200" y="14" fill="#79716b" fontSize="10">
              Baseline
            </text>
            <text x="175" y="68" fill="#e5484d" fontSize="10">
              Anomaly
            </text>
          </svg>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
          <span className="flex items-center gap-2 text-fg-muted">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-surface-2 font-mono text-[9px] text-fg-faint">
              #
            </span>
            Sent to <span className="font-medium text-fg-dim">#product-alerts</span>
          </span>
          <span className="text-fg-faint">{pulseAlert.delivered}</span>
        </div>
      </div>
    </div>
  );
}

const mocks = { graph: <CortexMock />, ask: <AskMock />, pulse: <PulseMock /> };

/**
 * Pinned feature scroller — ports the original "Scroll Progress Section":
 * the left text panels (Cortex / Ask / Pulse) scroll vertically while the right
 * visual is `position: sticky` (pinned to the viewport) and crossfades to the
 * active feature, with a 01/02/03 progress rail. Reduces to a simple stacked
 * layout on mobile (where the original hides the sticky column too).
 */
export function FeatureSpotlights() {
  const [active, setActive] = useState(0);
  // null until measured, so we mount each WebGL mock exactly once (desktop OR mobile)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 810px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Which left panel is at viewport centre = the active feature.
  useEffect(() => {
    if (!isDesktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.idx));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    panelRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [isDesktop]);

  return (
    <section className="relative">
      <div className="grid px-6 md:grid-cols-2 md:gap-14 md:px-10">
        {/* LEFT — scrolling text panels (always SSR-rendered) */}
        <div>
          {spotlights.map((f, i) => (
            <div
              key={f.name}
              data-idx={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="flex min-h-[70vh] flex-col justify-center py-16 md:min-h-screen md:py-0"
            >
              <ChromaticCascade
                blocks={[
                  {
                    kind: "text",
                    tag: "h2",
                    className: "text-h2-section text-fg",
                    segments: [{ text: f.name }],
                  },
                  {
                    kind: "text",
                    tag: "p",
                    className: "mt-5 max-w-[560px] text-base leading-relaxed text-fg-muted",
                    segments: [{ text: f.body }],
                  },
                  {
                    kind: "node",
                    children: (
                      <>
                        <div className="mt-10 grid max-w-[580px] grid-cols-1 gap-7 sm:grid-cols-3">
                          {f.bullets.map((b, bi) => (
                            <div key={b}>
                              <span className="text-fg-faint">
                                <MiniGlyph i={bi} />
                              </span>
                              <p className="mt-3 max-w-[170px] text-[15px] leading-snug text-fg-dim">
                                {b}
                              </p>
                            </div>
                          ))}
                        </div>
                        <ExploreMore href={f.href} />
                      </>
                    ),
                  },
                ]}
              />

              {/* Mobile: visual inline under its text (mounts once, client-only) */}
              {isDesktop === false && <div className="mt-12 flex justify-center">{mocks[f.mock]}</div>}
            </div>
          ))}
        </div>

        {/* RIGHT — sticky pinned visual + progress rail (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky top-[68px] flex h-[calc(100vh-68px)] items-center gap-8">
            <div
              className="relative h-full flex-1"
              style={{
                WebkitMaskImage: "linear-gradient(270deg, #0000 6%, #000 48%)",
                maskImage: "linear-gradient(270deg, #0000 6%, #000 48%)",
              }}
            >
              {isDesktop &&
                spotlights.map((f, i) => (
                  <div
                    key={f.name}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                      active === i
                        ? "opacity-100 blur-0"
                        : "pointer-events-none translate-y-3 opacity-0 blur-[2px]"
                    }`}
                  >
                    {mocks[f.mock]}
                  </div>
                ))}
            </div>
            <ProgressRail active={active} count={spotlights.length} />
          </div>
        </div>
      </div>
    </section>
  );
}
