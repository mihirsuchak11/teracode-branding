/**
 * Dashboard origin. This site is static and holds no secrets, so CTAs are
 * links that carry intent into the TeraCodeAI app:
 *   `{APP}/login?next=/projects/new`
 *
 * Logged-in visitors are handled there (`safeNext`). Override the origin with
 * `NEXT_PUBLIC_APP_URL` for a preview or local dashboard. The default matches
 * the public brand host (`teracodeai.com` → `app.teracodeai.com`); neither
 * DEPLOY.md nor this repo records a different production hostname.
 */
export const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.teracodeai.com"
).replace(/\/$/, "");

export const APP_LOGIN = `${APP_ORIGIN}/login`;

/** Start free / Get started — connect the first (free) repository. */
export const APP_START = `${APP_LOGIN}?next=/projects/new`;
