import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageShell } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { buildMetadata } from "@/lib/metadata";
import { posts, placeholderBody } from "@/content/blog";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return buildMetadata({ title: "Blog", description: "Notes from the Strand team.", path: "/blog" });
  }
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <PageShell>
        <article className="px-6 py-14 md:px-10">
          <Reveal className="max-w-[683px]">
            <Link
              href="/blog"
              className="font-mono text-xs font-medium text-fg-muted transition-colors hover:text-fg"
            >
              &larr; All posts
            </Link>
            <h1 className="mt-6 text-2xl font-semibold leading-[1.1] tracking-tight text-fg md:text-[32px]">
              {post.title}
            </h1>
            <p className="mt-4 font-mono text-xs font-medium leading-4 text-fg-faint">
              {post.date}
            </p>
            <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8">
              {(post.body ?? placeholderBody).map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-6 text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </article>
      </PageShell>
      <CtaBand />
    </>
  );
}
