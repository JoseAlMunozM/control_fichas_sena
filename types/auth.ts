import type { USER_ROLE } from "@/constants/auth";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
