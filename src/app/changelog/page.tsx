import { ChangelogList } from "@/components/sections/ChangelogList";
import { PageShell, PageHero } from "@/components/sections/PageShell";
import { buildMetadata } from "@/lib/metadata";
import { changelogHero, releases } from "@/content/changelog";

export const metadata = buildMetadata({
  title: "Changelog",
  description:
    "What has shipped in TeraCodeAI — the GitHub App, dashboard, and $20-per-repo meter.",
  path: "/changelog",
});

function StatusPill() {
  return (
    <div className="flex h-10 items-center gap-3 rounded-full border border-border px-4">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      <span className="text-xs font-medium text-fg">{changelogHero.status.label}</span>
      <span aria-hidden="true" className="h-4 w-px bg-border-strong" />
      <span className="font-mono text-xs font-medium text-fg-faint">
        {changelogHero.status.uptime}
      </span>
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <PageShell>
      <PageHero title={changelogHero.title} right={<StatusPill />} />
      <ChangelogList releases={releases} />
    </PageShell>
  );
}
