import type { Session } from "next-auth";

import { USER_ROLE } from "@/constants";

export function isDevelopmentAuthBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.DEV_AUTH_BYPASS === "true"
  );
}

export function createDevelopmentSession(): Session {
  return {
    user: {
      id: "development-preview",
      name: "Jose Muñoz",
      email: null,
      image: null,
      role: USER_ROLE.ADMIN,
    },
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}
