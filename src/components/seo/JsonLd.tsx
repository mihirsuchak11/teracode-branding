/**
 * Structured data, rendered as a native `<script type="application/ld+json">`.
 *
 * Per the Next.js JSON-LD guide: `next/script` is for executable JavaScript,
 * and JSON-LD is data, so a plain script tag is the right element. `<` is
 * escaped to its unicode form because `JSON.stringify` does not sanitise
 * markup, and any string reaching this payload originates in content files.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
