/**
 * Dashboard origin. This site is static and holds no secrets, so CTAs are
 * links that carry intent into the TeraCodeAI app:
 *   `{APP}/start`      →  `/login?next=/projects/new`
 *   `{APP}/subscribe`  →  `/login?next=/billing`
 *
 * Never embed a Razorpay `rzp.io` Subscription Link here. That URL is
 * created per organization after login; putting one on this site would
 * charge every visitor against a single test subscription.
 *
 * Logged-in visitors are handled there (`safeNext`). Override the origin with
 * `NEXT_PUBLIC_APP_URL` for a preview or local dashboard.
 *
 * The default is the Vercel host because it is the only dashboard origin that
 * currently resolves: `app.teracodeai.com` is NXDOMAIN, so defaulting to it
 * made every CTA on this site a dead link. `teracodeai.vercel.app` is also the
 * `homepage` recorded on the product repository. Once the apex domain has DNS,
 * set `NEXT_PUBLIC_APP_URL=https://app.teracodeai.com` — no code change needed.
 */
export const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://teracodeai.vercel.app"
).replace(/\/$/, "");

export const APP_LOGIN = `${APP_ORIGIN}/login`;

export const MAIL_CONTACT = "mailto:contact@teracodeai.com";

/** Start free / Get started — connect the first (free) repository. */
export const APP_START = `${APP_ORIGIN}/start`;

/** Extra-repo checkout — INR ₹1,699 or USD $20 on Razorpay hosted checkout. */
export const APP_SUBSCRIBE = `${APP_ORIGIN}/subscribe`;

/** Student / OSS apply form on Plans & billing (same page as subscribe). */
export const APP_BILLING = `${APP_LOGIN}?next=/billing`;
