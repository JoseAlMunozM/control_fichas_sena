import { NextResponse } from "next/server";

import { AUTH_ROUTES } from "@/constants";
import { auth } from "@/lib/auth";
import { isDevelopmentAuthBypassEnabled } from "@/lib/auth/development";
import { getAllowedRoles, isPublicRoute } from "@/lib/auth/routes";
import { hasAnyRole } from "@/lib/auth/roles";

export const proxy = auth((request) => {
  const { pathname, search } = request.nextUrl;

  if (isDevelopmentAuthBypassEnabled()) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const signInUrl = new URL(AUTH_ROUTES.signIn, request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

    return NextResponse.redirect(signInUrl);
  }

  const allowedRoles = getAllowedRoles(pathname);

  if (
    allowedRoles &&
    !hasAnyRole(request.auth.user.role, allowedRoles)
  ) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
