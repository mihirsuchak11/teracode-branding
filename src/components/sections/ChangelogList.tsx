import Image from "next/image";
import type { ChangelogRelease } from "@/content/changelog";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticHeading } from "@/components/motion/ChromaticLines";

const labelColor = {
  NEW: "text-brand",
  IMPROVED: "text-info",
  FIXED: "text-warn",
} as const;

type Group = {
  label?: "NEW" | "IMPROVED" | "FIXED";
  texts: string[];
};

/** Consecutive unlabeled items belong to the previous label's list. */
function groupItems(items: ChangelogRelease["items"]): Group[] {
  const groups: Group[] = [];
  for (const item of items) {
    if (item.label || groups.length === 0) {
      groups.push({ label: item.label, texts: [item.text] });
    } else {
      groups[groups.length - 1].texts.push(item.text);
    }
  }
  return groups;
}

export function ChangelogList({ releases }: { releases: ChangelogRelease[] }) {
  return (
    <div>
      {releases.map((release) => (
        <article
          key={release.version}
          className="grid border-b border-border last:border-b-0 md:grid-cols-[373px_1fr]"
        >
          {/* Version tab, pinned to the divider */}
          <div className="border-border md:border-r">
            <div className="border-b border-border p-4 md:ml-auto md:w-[187px] md:border-l">
              <p className="font-mono text-sm font-medium leading-5 text-fg">
                {release.version}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-fg-muted">{release.date}</p>
            </div>
          </div>

          <div className="px-6 pb-16 pt-8 md:px-8">
            <ChromaticHeading
              as="h2"
              className="max-w-[683px] text-2xl font-semibold leading-[1.07] tracking-tight text-fg md:text-[32px]"
              text={release.title}
            />
            <Reveal>
            {release.image && (
              <div
                className="mt-8 flex justify-center p-8 md:p-20"
                style={{
                  backgroundImage:
                    "radial-gradient(#1c1917 0.75px, transparent 0.75px)",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "4px 4px",
                }}
              >
                <Image
                  src={release.image.src}
                  alt={release.image.alt}
                  width={release.image.width}
                  height={release.image.height}
                  className="w-full max-w-[523px]"
                />
              </div>
            )}
            {groupItems(release.items).map((group, gi) => (
              <div key={`${release.version}-${gi}`} className="mt-8">
                {group.label && (
                  <p
                    className={`font-mono text-xs font-medium leading-4 ${labelColor[group.label]}`}
                  >
                    {group.label}
                  </p>
                )}
                <ul className="mt-4 list-disc space-y-0 pl-[19px] marker:text-fg-faint">
                  {group.texts.map((text) => (
                    <li key={text} className="text-sm leading-5 text-fg-muted">
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            </Reveal>
          </div>
        </article>
      ))}
    </div>
  );
}
