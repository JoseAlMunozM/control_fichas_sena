import type {
  ComponentType,
  PropsWithChildren,
  SVGProps,
} from "react";

import type { NavigationIconName } from "@/types";

export type IconProps = SVGProps<SVGSVGElement>;

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

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.5 10.5 8.5-7 8.5 7M5.5 9v10.5h13V9M9.5 19.5v-6h5v6"
      />
    </Icon>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="4" rx="1.5" />
      <rect x="13.5" y="10.5" width="7" height="10" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    </Icon>
  );
}

export function FichasIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 5.5H5.5a2 2 0 0 0-2 2v12h13v-2.5M8 3.5h9.5a2 2 0 0 1 2 2v9h-9a2.5 2.5 0 0 1-2.5-2.5V3.5Z"
      />
      <path strokeLinecap="round" d="M11.5 8h4.5M11.5 11.5H16" />
    </Icon>
  );
}

export function ProgramasIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4.5h6a2 2 0 0 1 2 2v13a2.5 2.5 0 0 0-2.5-2.5H4V4.5Zm16 0h-6a2 2 0 0 0-2 2v13a2.5 2.5 0 0 1 2.5-2.5H20V4.5Z"
      />
    </Icon>
  );
}

export function InstructoresIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 19.5v-1.25A3.25 3.25 0 0 0 12.25 15h-5.5a3.25 3.25 0 0 0-3.25 3.25v1.25M9.5 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 11.5a3.5 3.5 0 0 0 0-7M17 15a3.25 3.25 0 0 1 3.5 3.25v1.25"
      />
    </Icon>
  );
}

export function ProrrogasIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5v3M17 3.5v3M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v13H4v-13A1.5 1.5 0 0 1 5.5 5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 13.5a3 3 0 1 0 .25 4M15.5 13.5V16h-2.25"
      />
    </Icon>
  );
}

export const NAVIGATION_ICONS = {
  home: HomeIcon,
  dashboard: DashboardIcon,
  fichas: FichasIcon,
  programas: ProgramasIcon,
  instructores: InstructoresIcon,
  prorrogas: ProrrogasIcon,
} satisfies Record<NavigationIconName, ComponentType<IconProps>>;
