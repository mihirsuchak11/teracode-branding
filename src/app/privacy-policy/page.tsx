import { LegalArticle } from "@/components/sections/LegalArticle";
import { buildMetadata } from "@/lib/metadata";
import { privacyPolicy } from "@/content/legal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How TeraSoft AI collects, uses and protects information when you use TeraCode — including repository access and the model provider keys you supply.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <LegalArticle doc={privacyPolicy} />;
}
