import { LegalArticle } from "@/components/sections/LegalArticle";
import { buildMetadata } from "@/lib/metadata";
import { privacyPolicy } from "@/content/legal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How TeraCodeAI collects, uses and protects information — including cloned pull requests, BYOK keys, and review sandboxes.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <LegalArticle doc={privacyPolicy} />;
}
