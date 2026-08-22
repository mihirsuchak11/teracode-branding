import { LegalArticle } from "@/components/sections/LegalArticle";
import { buildMetadata } from "@/lib/metadata";
import { termsOfService } from "@/content/legal";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "The terms that govern TeraCodeAI — BYOK multi-agent pull request review, including cloning PRs, keys, and sandboxes.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return <LegalArticle doc={termsOfService} />;
}
