import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ChromaticFilters } from "@/components/motion/ChromaticReveal";
import { ChromaticGlareBand } from "@/components/motion/ChromaticGlareBand";
import { buildMetadata } from "@/lib/metadata";
import { siteGraph } from "@/lib/jsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font used by the original for large headlines and stat numbers.
const cabinet = localFont({
  variable: "--font-cabinet",
  display: "swap",
  src: [
    { path: "../fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/CabinetGrotesk-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = buildMetadata({
  title: "TeraCodeAI — Ship fast and secure with AI agents on every change",
  description:
    "TeraCodeAI is the platform to build and ship AI agents, and the agents we run on it for you. Review reads every pull request today on your own model keys; Studio, Runtime and Evals are the platform underneath. First connected repository free; $20 per extra repo per month.",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cabinet.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={siteGraph} />
        <SmoothScroll />
        <ChromaticFilters />
        <Header />
        {/* Hairline page frame, as in the original layout: the content column
            is capped at 1600px and centred, so ultra-wide viewports get margin
            on both sides instead of a left-aligned page. The header shares the
            same cap so its logo and CTA line up with the frame edges. */}
        <div className="flex flex-1 flex-col px-4 md:px-10 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col border-x border-border">
            <main className="flex-1 pt-[68px]">{children}</main>
            <Footer />
          </div>
        </div>
        {/* Fixed bottom-of-viewport chromatic band — the original's "glare".
            Last in the body so it sits above the page content it smears. */}
        <ChromaticGlareBand />
      </body>
    </html>
  );
}
