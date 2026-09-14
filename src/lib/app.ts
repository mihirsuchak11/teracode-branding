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
 * The default is `app.teracode.ai`, the dashboard's production host, so the
 * links work even when the env var is missing. Never default to a platform
 * host such as `*.vercel.app`: the old default pointed every Sign in button at
 * a retired deployment that returned 404, and a brand site sending visitors
 * to a login page on a different, dead domain is what got `teracode.ai`
 * flagged by Google Safe Browsing as deceptive.
 */
export const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.teracode.ai"
).replace(/\/$/, "");

export const APP_LOGIN = `${APP_ORIGIN}/login`;

/**
 * On the site's own domain, whose MX is Zoho. `teracodeai.com` has no DNS at
 * all, so an address there bounces — and an unreachable contact is one more
 * mark against the site in a phishing check.
 */
export const CONTACT_EMAIL = "contact@teracode.ai";
export const MAIL_CONTACT = `mailto:${CONTACT_EMAIL}`;

/** Start free / Get started — connect the first (free) repository. */
export const APP_START = `${APP_ORIGIN}/start`;

/** Extra-repo checkout — INR ₹2,999 or USD $29 on Razorpay hosted checkout. */
export const APP_SUBSCRIBE = `${APP_ORIGIN}/subscribe`;

/** Student / OSS apply form on Plans & billing (same page as subscribe). */
export const APP_BILLING = `${APP_LOGIN}?next=/billing`;
