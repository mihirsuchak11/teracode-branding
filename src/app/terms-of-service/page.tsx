import { LegalArticle } from "@/components/sections/LegalArticle";
import { buildMetadata } from "@/lib/metadata";
import { termsOfService } from "@/content/legal";

export const metadata = buildMetadata({
  title: "Terms and Conditions",
  description:
    "The terms and conditions that govern your access to and use of Strand.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return <LegalArticle doc={termsOfService} />;
}
