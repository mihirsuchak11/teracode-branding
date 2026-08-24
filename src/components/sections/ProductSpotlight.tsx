"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  applicationSpotlights as products,
  graphSources,
  migrateComposer,
  productsSection,
  pulseAlert,
} from "@/content/home";
import {
  applications,
  platform,
  productGroups,
  productHref,
  productStatus,
} from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChevronDown } from "@/components/ui/icons";
import { StrandMorph, type MorphShape } from "@/components/three/StrandMorph";
import { ASK_SHAPE, CORTEX_SHAPE, PULSE_SHAPE } from "@/components/three/morphShapes";
import { AskComposer } from "@/components/sections/AskChatAnim";
import { ProgressRuler } from "@/components/sections/ProgressRuler";

/**
 * The three clouds the strand field morphs between, index-aligned with the
 * applications (Review, Migrate, Oncall), with the exact thresholds and scales
 * the original passed. Module-level so the identity is stable — a new array would
 * rebuild the whole GPGPU sim.
 */
const MORPH_SHAPES: MorphShape[] = [
  { points: CORTEX_SHAPE, threshold: 0.6, scale: 0.92 },
  { points: ASK_SHAPE, threshold: 0.4, scale: 1 },
  { points: PULSE_SHAPE, threshold: 0.45, scale: 0.95 },
];

/** The ease the original uses for every card/row entrance in this section. */
const ROW_EASE = [0.44, 0, 0.56, 1] as const;

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

/**
 * The whole lineup in one row under the section heading, so a visitor sees
 * all seven products before the pinned scroller (three screens of
 * applications) and the platform grid below it.
 */
function LineupIndex() {
  const groups = [
    { key: "applications", title: productGroups.applications.title, items: applications },
    { key: "platform", title: productGroups.platform.title, items: platform },
  ];
  return (
    <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
      {groups.map((g) => (
        <div key={g.key} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-widest text-fg-faint">
            {g.title}
          </span>
          {g.items.map((p) => (
            <Link
              key={p.slug}
              href={productHref(p)}
              title={productStatus[p.status].label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[13px] text-fg-dim transition-colors hover:border-border-strong hover:text-fg"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  p.status === "available" ? "bg-brand" : "bg-warn"
                }`}
              />
              {p.short}
            </Link>
          ))}
        </div>
      ))}
      <p className="w-full text-xs text-fg-faint">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle" />
        {productStatus.available.label}
        <span className="ml-4 mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-warn align-middle" />
        {productStatus["coming-soon"].label}
      </p>
    </div>
  );
}

function ExploreMore({ href, label }: { href: string; label: string }) {
  const Tag = href.startsWith("mailto:") || href.startsWith("http") ? "a" : Link;
  return (
    <Tag href={href} className="group mt-10 inline-flex items-center gap-3 text-[15px] text-fg-dim">
      {label}
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
        <ChevronDown width={13} height={13} className="-rotate-90 text-fg-muted" />
      </span>
    </Tag>
  );
}

function CortexMock() {
  const dot: Record<string, string> = {
    Done: "bg-brand",
    Running: "bg-info",
    Queued: "bg-warn",
  };
  return (
    <div className="flex w-[289px] flex-col items-center gap-2">
      {graphSources.map((s, i) => (
        <motion.div
          key={s.name}
          className="flex w-full items-center gap-4 rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4"
          initial={{ opacity: 0.001, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05, ease: ROW_EASE }}
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-[16px] leading-6 text-fg">{s.name}</p>
            <p className="font-mono text-[12px] leading-4 font-medium text-[rgb(115,115,115)]">
              {s.detail}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-2 text-[12px] leading-4 whitespace-pre text-fg">
            <span className={`h-2 w-2 rounded-full ${dot[s.status]}`} />
            {s.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function AskMock() {
  return <AskComposer chips={3} className="w-[401px]" placeholder={migrateComposer} />;
}

function PulseMock() {
  return (
    <div className="w-[297px] rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4">
      <div className="flex items-center gap-4">
        <span className="rounded bg-danger-soft/60 px-2 py-1 text-[12px] leading-4 font-medium whitespace-pre text-danger">
          {pulseAlert.severity}
        </span>
        <span className="flex-1 text-right text-[11px] leading-4 font-medium text-fg-faint">
          {pulseAlert.time}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <p className="text-[16px] leading-6 text-fg">{pulseAlert.title}</p>
        <p className="text-[12px] leading-4 text-[rgb(115,115,115)]">{pulseAlert.body}</p>
      </div>

      {/* Baseline vs anomaly trace — the labels sit on the plot like the original */}
      <div className="relative mt-4">
        <svg viewBox="0 0 260 78" className="w-full">
          {/* Faint horizontal divisions, like the original's yDivisions: 2 */}
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1="0"
              x2="260"
              y1={7 + i * 25}
              y2={7 + i * 25}
              stroke="rgb(23,23,23)"
              strokeWidth="1"
            />
          ))}
          {/* Learned baseline */}
          <polyline
            points="0,8 65,15 130,8 195,13 260,9"
            fill="none"
            stroke="rgb(64,64,64)"
            strokeWidth="1"
          />
          {/* Actual: flat, then the drop that trips the alert, then a partial
              recovery — the original's series is 91,84,91,85,91,34,55. */}
          <polyline
            points="0,7 43,12.5 87,7 130,11.7 173,7"
            fill="none"
            stroke="rgb(64,64,64)"
            strokeWidth="1"
          />
          <polyline
            points="173,7 217,51.5 260,35"
            fill="none"
            stroke="#e5484d"
            strokeWidth="1"
          />
          <circle cx="217" cy="51.5" r="3" fill="#e5484d" />
        </svg>
        <span className="absolute top-[21%] left-[86%] text-[11px] leading-4 font-medium text-[rgb(82,82,82)]">
          {pulseAlert.labels.baseline}
        </span>
        <span className="absolute top-[81%] left-[88%] text-[11px] leading-4 font-medium text-danger">
          {pulseAlert.labels.anomaly}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] leading-4 font-medium">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-[rgb(23,23,23)] font-mono text-[9px] text-[rgb(82,82,82)]">
          #
        </span>
        <span className="whitespace-pre text-fg-muted">
          <span className="text-[rgb(115,115,115)]">{pulseAlert.routed}</span>{" "}
          {pulseAlert.channel}
        </span>
        <span className="flex-1 text-right text-fg-muted">{pulseAlert.delivered}</span>
      </div>
    </div>
  );
}

const mocks = { graph: <CortexMock />, ask: <AskMock />, pulse: <PulseMock /> };

/**
 * Pinned product scroller — ports the original "Scroll Progress Section".
 *
 * The left text panels (Review / Migrate / Oncall) scroll while the right column is
 * `position: sticky`. That column is ONE WebGL strand field (`StrandMorph`)
 * that morphs between a point cloud per feature, with the matching UI card
 * carried in front of it. Both the morph and the card swap are driven by the
 * left column's scroll progress, exactly as in the original:
 *
 *   index   = clamp(floor(progress * 3), 0, 2)
 *   visible = triangle(clamp(progress, 1/6, 5/6), 3) * 0.5 + 0.3 > 0
 *
 * That second line is the handover gap — the card is hidden for the first and
 * last 10% of each third, so the strands are alone while the shape changes.
 *
 * Reduces to a simple stacked layout on mobile, where the original hides the
 * sticky column too.
 */

/** Triangle wave over `sections` periods: -1 at each edge, +1 at each centre. */
function triangle(x: number, sections: number) {
  const period = 1 / sections;
  const a = ((((x % period) % period) + period) % period) / period;
  return a < 0.5 ? 4 * a - 1 : 3 - 4 * a;
}

export function ProductSpotlights() {
  const [active, setActive] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  // null until measured, so the WebGL field mounts exactly once (desktop only)
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: panelsRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const count = products.length;
    setActive(Math.min(Math.max(Math.floor(p * count), 0), count - 1));
    const edge = 1 / (count * 2);
    const clamped = Math.min(Math.max(p, edge), 1 - edge);
    setCardVisible(triangle(clamped, count) * 0.5 + 0.3 > 0);
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 810px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section id={productsSection.id} className="relative scroll-mt-[68px]">
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <SectionHeading
          align="left"
          eyebrow={productsSection.eyebrow}
          title={productsSection.title}
          body={productsSection.body}
        />
        <LineupIndex />
        <p className="mt-16 border-t border-border pt-6 text-sm text-fg-muted md:mt-20">
          <span className="font-mono text-xs uppercase tracking-widest text-fg">
            {productGroups.applications.title}
          </span>
          <span className="mx-3 text-fg-faint">∴</span>
          {productGroups.applications.body}
        </p>
      </div>
      <div className="grid px-6 md:grid-cols-2 md:gap-14 md:px-10">
        {/* LEFT — scrolling text panels (always SSR-rendered). Its scroll
            progress is what drives the morph, the card swap and the ruler. */}
        <div ref={panelsRef}>
          {products.map((f) => (
            <div
              key={f.name}
              className="flex min-h-[70vh] flex-col justify-center py-16 md:min-h-screen md:py-0"
            >
              <ChromaticCascade
                blocks={[
                  {
                    kind: "node",
                    children: (
                      <Badge tone={productStatus[f.status].tone} className="mb-5">
                        {productStatus[f.status].label}
                      </Badge>
                    ),
                  },
                  {
                    kind: "text",
                    tag: "h2",
                    className: "text-h2-section text-fg",
                    segments: [{ text: f.short }],
                  },
                  {
                    kind: "text",
                    tag: "p",
                    className: "mt-5 max-w-[560px] text-base leading-relaxed text-fg-muted",
                    segments: [{ text: `${f.tagline}. ${f.body}` }],
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
                        <ExploreMore
                          href={f.href}
                          label={f.status === "available" ? "Learn more" : "See what is coming"}
                        />
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

        {/* RIGHT — sticky strand field + swapping card + ruler (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
            <div className="relative flex h-[508px] w-full items-center justify-center gap-4">
              <div
                className="relative h-full flex-1"
                style={{
                  // The original masks both axes, fading the field out at all
                  // four edges of the sticky frame.
                  WebkitMaskImage:
                    "linear-gradient(0deg, #0000 0%, #000 10%, #000 90%, #0000 100%), linear-gradient(90deg, #0000 0%, #000 10%, #000 90%, #0000 100%)",
                  WebkitMaskComposite: "source-in",
                  maskImage:
                    "linear-gradient(0deg, #0000 0%, #000 10%, #000 90%, #0000 100%), linear-gradient(90deg, #0000 0%, #000 10%, #000 90%, #0000 100%)",
                  maskComposite: "intersect",
                }}
              >
                {isDesktop && (
                  <StrandMorph
                    shapes={MORPH_SHAPES}
                    currentShape={active}
                    className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
                    cameraFov={34}
                    cameraPosition={{ x: 0, y: 0, z: 1.8 }}
                    tipRadius={0.003}
                    tipLayers={8}
                    sizeVariance={0.5}
                    dispersion={0.8}
                    dispersionBand={0.9}
                    dispersionOffset={0.05}
                    simSpring={60}
                    simDamping={7}
                    simMaxVelocity={9.5}
                    springVariance={22.6}
                    opacitySpeed={5.3}
                  />
                )}

                <AnimatePresence mode="wait" initial={false}>
                  {isDesktop && cardVisible && (
                    <motion.div
                      key={active}
                      className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 select-none"
                      initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: {
                          duration: 0.1,
                          ease: "easeOut",
                          filter: { duration: 0.3, ease: "easeOut" },
                          scale: { duration: 0.3, ease: "easeOut" },
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        filter: "blur(8px)",
                        transition: { duration: 0.15, ease: "easeIn" },
                      }}
                    >
                      {mocks[products[active].mock]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Rail: full-height strip, vertically centring a 300px ruler. */}
            <div className="absolute top-0 right-px bottom-0 flex items-center">
              <ProgressRuler
                target={panelsRef}
                sections={products.length}
                className="h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
