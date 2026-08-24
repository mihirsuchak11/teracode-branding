/**
 * Client-side display default. Timezone is the honest signal for a static
 * marketing page (no IP lookup). Language tags ending in -IN are the fallback.
 */
export function preferInrFromBrowser(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return true;
  } catch {
    /* Intl missing — fall through to language. */
  }
  if (typeof navigator === "undefined") return false;
  const langs = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];
  return langs.some(
    (lang) => /[-_]IN\b/i.test(lang) || lang.toLowerCase() === "hi",
  );
}
