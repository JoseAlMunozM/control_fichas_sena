import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { AUTH_ROUTES } from "@/constants";
import { auth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/auth/roles";
import type { UserRole } from "@/types";

export class AuthorizationError extends Error {
  constructor(message = "No tienes permisos para realizar esta acción.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export const getCurrentSession = cache(async () => auth());

export async function requireAuth(): Promise<Session> {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(AUTH_ROUTES.signIn);
  }

  return session;
}

export async function requireRole(
  allowedRoles: readonly UserRole[],
): Promise<Session> {
  const session = await requireAuth();

  if (!hasAnyRole(session.user.role, allowedRoles)) {
    throw new AuthorizationError();
  }

  return session;
}
