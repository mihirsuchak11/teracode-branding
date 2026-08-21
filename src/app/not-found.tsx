import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden">
      {/* Particle "404", from the original's strand canvas */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/art/art-404.png"
        alt=""
        aria-hidden
        className="art-blend pointer-events-none absolute left-1/2 top-1/2 w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          maskImage: "radial-gradient(85% 62% at 50% 50%, black 25%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(85% 62% at 50% 50%, black 25%, transparent 78%)",
        }}
      />
      <div className="relative flex flex-col items-center px-6 py-10 text-center">
        <h1 className="text-lg font-semibold leading-6 text-fg">
          This page got lost in the graph.
        </h1>
        <p className="mt-1 text-sm leading-5 text-fg-muted">
          Let&apos;s get you back to somewhere that exists.
        </p>
        <div className="mt-5">
          <Button href="/" variant="secondary" size="sm">
            Back to homepage
          </Button>
        </div>
      </div>
    </section>
  );
}
