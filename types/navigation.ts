import type { UserRole } from "./auth";

export type RouteAccess = "public" | "authenticated";

export interface NavigationMetadata {
  menuId: string;
  order: number;
}

export interface AppRouteConfig {
  path: string;
  label: string;
  access: RouteAccess;
  exact?: boolean;
  roles?: readonly UserRole[];
  navigation?: NavigationMetadata;
}

export interface NavigationMenuConfig {
  id: string;
  label: string;
  order: number;
}

export interface NavigationMenu {
  id: string;
  label: string;
  items: readonly AppRouteConfig[];
}
