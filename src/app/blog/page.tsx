import Link from "next/link";
import { PageShell, PageHero } from "@/components/sections/PageShell";
import { ArrowUpRight } from "@/components/ui/icons";
import { buildMetadata } from "@/lib/metadata";
import { blogHero, posts } from "@/content/blog";

export const metadata = buildMetadata({
  title: "Blog",
  description: blogHero.body,
  path: "/blog",
});

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        title={blogHero.title}
        right={<p className="max-w-xs text-sm leading-5 text-fg-muted">{blogHero.body}</p>}
      />
      <div>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid gap-x-8 gap-y-2 border-b border-border px-6 py-7 transition-colors last:border-b-0 hover:bg-surface/60 md:grid-cols-[187px_1fr_auto] md:px-10"
          >
            <span className="pt-1 font-mono text-xs font-medium leading-4 text-fg-faint">
              {post.date}
            </span>
            <span>
              <span className="block text-lg font-medium leading-6 text-fg">
                {post.title}
              </span>
              <span className="mt-2 block max-w-[560px] text-sm leading-5 text-fg-muted">
                {post.excerpt}
              </span>
            </span>
            <ArrowUpRight
              width={16}
              height={16}
              className="hidden self-start text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg md:block"
            />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
