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
  title: "TeraCode — BYOK AI Code Review",
  description:
    "TeraCode Review puts an AI review board on every pull request, catching bugs, security issues and regressions before a human opens the diff. BYOK — bring your own API keys and pay your provider directly, with no markup and no per-seat licence. Private beta.",
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
        {/* Hairline page frame, as in the original layout */}
        <div className="mx-4 flex flex-1 flex-col border-x border-border md:mx-10 lg:mx-16">
          <main className="flex-1 pt-[68px]">{children}</main>
          <Footer />
        </div>
        {/* Fixed bottom-of-viewport chromatic band — the original's "glare".
            Last in the body so it sits above the page content it smears. */}
        <ChromaticGlareBand />
      </body>
    </html>
  );
}
