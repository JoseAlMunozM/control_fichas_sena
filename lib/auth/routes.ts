import {
  AUTH_ROUTES,
  ROUTE_CONFIG,
} from "@/constants";
import type { UserRole } from "@/types";
import { findRouteConfig } from "@/utils";

export function isPublicRoute(pathname: string): boolean {
  const isCronRoute =
    pathname === "/api/cron" || pathname.startsWith("/api/cron/");
  const isAuthRoute =
    pathname === AUTH_ROUTES.apiPrefix ||
    pathname.startsWith(`${AUTH_ROUTES.apiPrefix}/`);

  if (isAuthRoute || isCronRoute) {
    return true;
  }

  return (
    findRouteConfig(pathname, ROUTE_CONFIG)?.access === "public"
  );
}

export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

export function getAllowedRoles(
  pathname: string,
): readonly UserRole[] | null {
  return findRouteConfig(pathname, ROUTE_CONFIG)?.roles ?? null;
}
