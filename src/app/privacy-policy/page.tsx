import { LegalArticle } from "@/components/sections/LegalArticle";
import { buildMetadata } from "@/lib/metadata";
import { privacyPolicy } from "@/content/legal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Strand collects, uses, and protects information when you use our Service.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <LegalArticle doc={privacyPolicy} />;
}
