import type { NavigationItem } from "@/types";

export const MAIN_NAVIGATION = [
  {
    href: "/",
    label: "Inicio",
    exact: true,
  },
] as const satisfies readonly NavigationItem[];
