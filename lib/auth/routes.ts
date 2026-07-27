import {
  AUTH_ROUTES,
  PUBLIC_ROUTES,
  USER_ROLE,
} from "@/constants";
import type { RoleRouteRule, UserRole } from "@/types";

const ROLE_ROUTE_RULES: readonly RoleRouteRule[] = [
  {
    pathPrefix: "/admin",
    roles: [USER_ROLE.ADMIN],
  },
];

export function isPublicRoute(pathname: string): boolean {
  return (
    pathname.startsWith(AUTH_ROUTES.apiPrefix) ||
    PUBLIC_ROUTES.some((route) => route === pathname)
  );
}

export function getAllowedRoles(
  pathname: string,
): readonly UserRole[] | null {
  const rule = ROLE_ROUTE_RULES.find(
    ({ pathPrefix }) =>
      pathname === pathPrefix ||
      pathname.startsWith(`${pathPrefix}/`),
  );

  return rule?.roles ?? null;
}
