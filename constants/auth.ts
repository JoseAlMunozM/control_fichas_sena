import { ROUTE_PATHS } from "./routes";

export const USER_ROLE = {
  ADMIN: "ADMIN",
  COORDINATOR: "COORDINATOR",
  INSTRUCTOR: "INSTRUCTOR",
  USER: "USER",
} as const;

export const DEFAULT_USER_ROLE = USER_ROLE.USER;

export const AUTH_ROUTES = {
  apiPrefix: "/api/auth",
  signIn: "/login",
  setup: "/setup",
  afterSignIn: ROUTE_PATHS.home,
} as const;
