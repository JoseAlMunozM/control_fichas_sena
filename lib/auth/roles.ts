import type { UserRole } from "@/types";

export function hasAnyRole(
  role: UserRole,
  allowedRoles: readonly UserRole[],
): boolean {
  return allowedRoles.includes(role);
}
