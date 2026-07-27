import type { PropsWithChildren, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({
  children,
  ...props
}: PropsWithChildren<IconProps>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3 3.9 3.9M20.1 20.1l-1.4-1.4M18.7 5.3l1.4-1.4M3.9 20.1l1.4-1.4"
      />
    </Icon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8a8.5 8.5 0 1 0 11.4 11.4Z"
      />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </Icon>
  );
}
