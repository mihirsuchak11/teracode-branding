import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const base = (props: Props) => ({
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const ChevronDown = (props: Props) => (
  <svg {...base(props)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowUpRight = (props: Props) => (
  <svg {...base(props)}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ArrowRight = (props: Props) => (
  <svg {...base(props)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const Check = (props: Props) => (
  <svg {...base(props)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const Minus = (props: Props) => (
  <svg {...base(props)}>
    <path d="M5 12h14" />
  </svg>
);

export const Plus = (props: Props) => (
  <svg {...base(props)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const Menu = (props: Props) => (
  <svg {...base(props)}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

export const Close = (props: Props) => (
  <svg {...base(props)}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Mic = (props: Props) => (
  <svg {...base(props)}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
    <path d="M12 18v4" />
  </svg>
);

export const XSocial = (props: Props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const LinkedIn = (props: Props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0" />
  </svg>
);

export const GitHub = (props: Props) => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
  </svg>
);

/* ---------------------------------------------------------------------------
 * Icons used by the Statement section's "Ask Chat Anim" mock. These mirror the
 * exact lucide glyphs the original Framer component passed to each slot.
 * ------------------------------------------------------------------------- */

/** Quick action: Analyze. */
export const ChartPie = (props: Props) => (
  <svg {...base(props)}>
    <path d="M21 12c.552 0 1.005-.449.95-.998A9.001 9.001 0 0 0 12.998 2.05c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
  </svg>
);

/** Quick action: Compare. */
export const AlignHorizontalJustifyCenter = (props: Props) => (
  <svg {...base(props)}>
    <rect x="2" y="5" width="6" height="14" rx="2" />
    <rect x="16" y="7" width="6" height="10" rx="2" />
    <path d="M12 2v20" />
  </svg>
);

/** Quick action: Monitor. */
export const Activity = (props: Props) => (
  <svg {...base(props)}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
);

/** Quick action: Report. */
export const ClipboardList = (props: Props) => (
  <svg {...base(props)}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

/** Result action: Export CSV. */
export const FileSpreadsheet = (props: Props) => (
  <svg {...base(props)}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M8 13h2" />
    <path d="M14 13h2" />
    <path d="M8 17h2" />
    <path d="M14 17h2" />
  </svg>
);

/** Result action: Share with team. */
export const MessageSquareShare = (props: Props) => (
  <svg {...base(props)}>
    <path d="M12 3H4a2 2 0 0 0-2 2v16.286a.5.5 0 0 0 .854.353l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-5" />
    <path d="M16 3h6v6" />
    <path d="M16 9l6-6" />
  </svg>
);

/** Send affordance — replaces the mic once the mock has a message typed. */
export const ChevronRight = (props: Props) => (
  <svg {...base(props)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/** The starburst mark the original uses as each result row's source logo
 *  (its "Nietzsche Logo" icon — exact path data from the site's bundle). */
export const Starburst = (props: Props) => (
  <svg width={16} height={16} viewBox="0 0 33.121 33" fill="currentColor" {...props}>
    <path
      transform="translate(0.256 0.743)"
      d="M 20.27 0.848 L 17.093 0 L 14.416 9.956 L 11.998 0.968 L 8.821 1.816 L 11.433 11.527 L 4.928 5.047 L 2.602 7.363 L 9.737 14.473 L 0.851 12.1 L 0 15.266 L 9.709 17.857 C 9.596 17.369 9.539 16.871 9.539 16.37 C 9.539 12.75 12.484 9.815 16.118 9.815 C 19.751 9.815 22.696 12.75 22.696 16.37 C 22.696 16.878 22.638 17.373 22.528 17.848 L 31.352 20.203 L 32.203 17.038 L 22.456 14.436 L 31.342 12.063 L 30.491 8.898 L 20.744 11.501 L 27.249 5.019 L 24.923 2.702 L 17.886 9.712 Z"
    />
    <path
      transform="translate(1.117 18.62)"
      d="M 21.658 0.009 C 21.389 1.138 20.824 2.175 20.021 3.013 L 26.414 9.382 L 28.74 7.065 Z M 19.957 3.08 C 19.146 3.905 18.132 4.503 17.017 4.811 L 19.343 13.461 L 22.52 12.612 L 19.957 3.079 Z M 16.898 4.843 C 16.361 4.98 15.81 5.049 15.256 5.049 C 14.663 5.049 14.073 4.97 13.501 4.813 L 11.173 13.47 L 14.35 14.318 Z M 13.389 4.781 C 12.29 4.457 11.294 3.851 10.501 3.024 L 4.093 9.408 L 6.419 11.726 Z M 10.448 2.967 C 9.666 2.135 9.115 1.112 8.852 0 L 0 2.364 L 0.851 5.529 Z"
    />
  </svg>
);
