import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "box"
  | "check"
  | "chat"
  | "close"
  | "globe"
  | "heart"
  | "leaf"
  | "menu"
  | "palette"
  | "package"
  | "shield"
  | "spark"
  | "whatsapp";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="m4 7 8 4 8-4M4 12l8 4 8-4M4 17l8 4 8-4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chat: <path d="M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a9 9 0 1 1 17-5Z" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.9 8.9 8.9-8.9a5.5 5.5 0 0 0-.1-7.8Z" />,
    leaf: (
      <>
        <path d="M20 4C10 4 5 8 5 14c0 3 2 5 5 5 6 0 10-5 10-15Z" />
        <path d="M4 21c3-6 7-9 13-12" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    palette: (
      <>
        <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h1a8 8 0 0 0-1-11Z" />
        <circle cx="7.5" cy="10" r=".8" fill="currentColor" stroke="none" />
        <circle cx="10" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    package: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M8 5V3h8v2M4 10h16M12 5v5" />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
    spark: <path d="M12 2c.7 6.1 3.9 9.3 10 10-6.1.7-9.3 3.9-10 10-.7-6.1-3.9-9.3-10-10 6.1-.7 9.3-3.9 10-10Z" />,
    whatsapp: (
      <>
        <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-3.9Z" />
        <path d="M8.4 7.7c.4-.3.9-.2 1.2.3l1 1.6c.2.3.1.7-.2 1l-.7.6c.8 1.7 2.2 3 3.9 3.8l.6-.7c.3-.4.7-.4 1-.2l1.6 1c.5.3.6.8.3 1.2-.8 1-2 1.4-3.2.9-3.3-1.3-6-4-7.3-7.3-.4-1.1 0-2 .8-2.2Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
