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

/** Strand logo mark: woven strand squiggle (single color, like the original). */
export const LogoMark = (props: Props) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M17 3c-6 1.5-11 4-10 7s12 1 13 4-4 6-11 7"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path
      d="M8 3c7 1.5 12 4.5 8 7"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      opacity={0.85}
    />
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
