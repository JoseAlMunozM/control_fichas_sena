import type {
  AppRouteConfig,
  NavigationMenuConfig,
} from "@/types/navigation";

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
      icon: "home",
    },
  },
  {
    path: ROUTE_PATHS.login,
    label: "Iniciar sesión",
    access: "public",
    exact: true,
  },
  {
    path: ROUTE_PATHS.setup,
    label: "Configuración inicial",
    access: "public",
    exact: true,
  },
  {
    path: ROUTE_PATHS.dashboard,
    label: "Dashboard",
    access: "authenticated",
    navigation: {
      menuId: "general",
      order: 2,
      icon: "dashboard",
    },
  },
  {
    path: ROUTE_PATHS.fichas,
    label: "Fichas",
    access: "authenticated",
    navigation: {
      menuId: "academic",
      order: 1,
      icon: "fichas",
    },
  },
  {
    path: ROUTE_PATHS.programas,
    label: "Programas",
    access: "authenticated",
    navigation: {
      menuId: "academic",
      order: 2,
      icon: "programas",
    },
  },
  {
    path: ROUTE_PATHS.instructores,
    label: "Instructores",
    access: "authenticated",
    navigation: {
      menuId: "people",
      order: 1,
      icon: "instructores",
    },
  },
  {
    path: ROUTE_PATHS.prorrogas,
    label: "Prórrogas",
    access: "authenticated",
    navigation: {
      menuId: "tracking",
      order: 1,
      icon: "prorrogas",
    },
  },
] as const satisfies readonly AppRouteConfig[];
