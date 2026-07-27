import type {
  AppRouteConfig,
  NavigationMenuConfig,
} from "@/types/navigation";

import { USER_ROLE } from "./auth";
import { ROUTE_PATHS } from "./routes";

export const NAVIGATION_MENUS = [
  {
    id: "general",
    label: "General",
    order: 1,
  },
  {
    id: "academic",
    label: "Gestión académica",
    order: 2,
  },
  {
    id: "people",
    label: "Talento humano",
    order: 3,
  },
  {
    id: "tracking",
    label: "Seguimiento",
    order: 4,
  },
  {
    id: "system",
    label: "Sistema",
    order: 5,
  },
] as const satisfies readonly NavigationMenuConfig[];

export const ROUTE_CONFIG = [
  {
    path: ROUTE_PATHS.home,
    label: "Inicio",
    access: "public",
    exact: true,
    navigation: {
      menuId: "general",
      order: 1,
    },
  },
  {
    path: ROUTE_PATHS.dashboard,
    label: "Dashboard",
    access: "authenticated",
    navigation: {
      menuId: "general",
      order: 2,
    },
  },
  {
    path: ROUTE_PATHS.fichas,
    label: "Fichas",
    access: "authenticated",
    navigation: {
      menuId: "academic",
      order: 1,
    },
  },
  {
    path: ROUTE_PATHS.programas,
    label: "Programas",
    access: "authenticated",
    navigation: {
      menuId: "academic",
      order: 2,
    },
  },
  {
    path: ROUTE_PATHS.competencias,
    label: "Competencias",
    access: "authenticated",
    navigation: {
      menuId: "academic",
      order: 3,
    },
  },
  {
    path: ROUTE_PATHS.instructores,
    label: "Instructores",
    access: "authenticated",
    navigation: {
      menuId: "people",
      order: 1,
    },
  },
  {
    path: ROUTE_PATHS.prorrogas,
    label: "Prórrogas",
    access: "authenticated",
    navigation: {
      menuId: "tracking",
      order: 1,
    },
  },
  {
    path: ROUTE_PATHS.admin,
    label: "Administración",
    access: "authenticated",
    roles: [USER_ROLE.ADMIN],
    navigation: {
      menuId: "system",
      order: 1,
    },
  },
] as const satisfies readonly AppRouteConfig[];
