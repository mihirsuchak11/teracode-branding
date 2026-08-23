import type { FeatureBenefit } from "@/lib/types";
import { type FeatureMidSection, featureMocks } from "@/content/features";

import { Reveal } from "@/components/motion/Reveal";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { AskChatAnim } from "@/components/sections/AskChatAnim";
import { FeatureMockCard } from "@/components/sections/FeatureMockCard";
import { ReviewBoardMock, ReviewPostedMock, ReviewRiskMock } from "@/components/sections/ReviewMocks";

/* Dotted-grid backdrop behind every demo mock, as in the original panels. */
const dots =
  "[background-image:radial-gradient(#221e1b_1px,transparent_1px)] [background-size:9px_9px]";

/** Full-width review loop over the wave art — copy is from `askChat`. */
function ReviewWavesPanel() {
  return (
    <div className="h-[500px] overflow-hidden border-t border-border">
      <AskChatAnim />
    </div>
  );
}

function PanelText({ benefit }: { benefit: FeatureBenefit }) {
  return (
    <ChromaticCascade
      blocks={[
        {
          kind: "text",
          tag: "h3",
          className: "text-[18px] font-semibold leading-6 text-fg",
          segments: [{ text: benefit.title }],
        },
        {
          kind: "text",
          tag: "p",
          className: "mt-2 text-base leading-6 text-fg-muted",
          segments: [{ text: benefit.body }],
        },
      ]}
    />
  );
}

function Panel({
  benefit,
  mock,
  dense = false,
  stage = 480,
}: {
  benefit: FeatureBenefit;
  mock: React.ReactNode;
  dense?: boolean;
  stage?: number;
}) {
  if (dense) {
    return (
      <div className="flex flex-col px-9 pb-9 pt-5">
        <Reveal
          className={`-mx-4 flex h-[422px] items-center justify-center overflow-hidden ${dots}`}
        >
          {mock}
        </Reveal>
        <div className="mt-14">
          <PanelText benefit={benefit} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col p-10">
      <Reveal
        className={`flex items-center justify-center overflow-hidden ${dots}`}
        style={{ height: stage }}
      >
        {mock}
      </Reveal>
      <div className="mt-10">
        <PanelText benefit={benefit} />
      </div>
    </div>
  );
}

/**
 * Hairline-divided demo panel grid under each feature hero.
 * Cards are the TeraCodeAI mocks from `featureMocks`, not the Strand leftovers.
 */
export function FeatureShowcase({ slug, benefits }: { slug: string; benefits: FeatureBenefit[] }) {
  const cards = featureMocks[slug] ?? [];
  /* Review is the launch page, so its three cards play rather than sit still.
     They read the same `featureMocks` copy as every other product. */
  const mocks =
    slug === "review"
      ? [
          <ReviewBoardMock key="0" mock={cards[0]} />,
          <ReviewRiskMock key="1" mock={cards[1]} />,
          <ReviewPostedMock key="2" mock={cards[2]} />,
        ]
      : cards.map((card, i) => <FeatureMockCard key={i} mock={card} />);
  const across = slug === "agents" ? benefits.length : Math.min(benefits.length, 2);
  const inGrid = benefits.slice(0, across);
  const fullWidth = benefits[across];

  return (
    <section className="border-y border-border">
      <div
        className={`grid divide-y divide-border md:divide-x md:divide-y-0 ${
          across === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {inGrid.map((benefit, i) => (
          <Panel
            key={benefit.title}
            benefit={benefit}
            mock={mocks[i]}
            dense={across === 3}
            stage={slug === "checks" ? 440 : 480}
          />
        ))}
      </div>
      {fullWidth && (
        <div className="grid border-t border-border md:grid-cols-2">
          <div className="flex flex-col justify-end p-10">
            <PanelText benefit={fullWidth} />
          </div>
          <Reveal
            className={`m-10 flex h-[446px] items-center justify-center overflow-hidden ${dots}`}
          >
            {mocks[across]}
          </Reveal>
        </div>
      )}
      {slug === "agents" && <ReviewWavesPanel />}
    </section>
  );
}

function KeepRateChartCard() {
  return (
    <div className="w-full max-w-[480px] rounded-xl border border-border bg-bg-deep p-5">
      <div className="flex items-center justify-between font-mono text-[11px] text-fg-faint">
        <span>Keep-rate · 30D</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          security
        </span>
      </div>
      <p className="mt-3 text-[15px] text-fg-soft">Findings the team kept, not model confidence</p>
      <svg viewBox="0 0 440 150" className="mt-5 w-full">
        <polygon
          points="0,96 70,90 140,84 210,70 280,52 350,36 440,28 440,58 350,64 280,80 210,98 140,112 70,116 0,120"
          fill="#10ec90"
          opacity="0.08"
        />
        <polyline
          points="0,96 70,90 140,84 210,70 280,52 350,36 440,28"
          fill="none"
          stroke="#10ec90"
          strokeWidth="1.3"
          opacity="0.75"
        />
        <polyline
          points="0,120 70,116 140,112 210,98 280,80 350,64 440,58"
          fill="none"
          stroke="#10ec90"
          strokeWidth="1.3"
          opacity="0.75"
        />
        <polyline
          points="0,110 70,104 140,100 210,86 280,64 350,48"
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="1.4"
        />
        <polyline
          points="350,48 395,44 440,40"
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[11px] text-fg-disabled">
        {["Week 1", "Week 2", "Week 3", "Week 4", "Now"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

/** Mid band on the checks page: two-tone headline, then keep-rate + accordion. */
export function PulseMidSection({ mid }: { mid: FeatureMidSection }) {
  const [first, ...rest] = mid.title.split("\n");
  return (
    <>
      <section className="flex h-[390px] items-center justify-center px-6">
        <ChromaticLines
          as="h2"
          className="max-w-[560px] text-center text-[28px] font-semibold tracking-tight md:text-[32px] md:leading-[34px]"
          segments={[
            { text: `${first} `, className: "text-fg-muted" },
            { text: rest.join(" "), className: "text-fg" },
          ]}
        />
      </section>
      <section className="grid items-center gap-12 border-t border-border px-6 py-16 md:grid-cols-[668fr_588fr] md:px-10">
        <Reveal className={`flex h-[450px] items-center justify-center overflow-hidden ${dots}`}>
          <KeepRateChartCard />
        </Reveal>
        <Reveal>
          <FeatureAccordion items={mid.items} muteClosed bodyGap="mt-4" dividers="all" marks />
        </Reveal>
      </section>
    </>
  );
}
