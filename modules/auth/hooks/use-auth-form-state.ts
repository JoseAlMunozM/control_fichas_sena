"use client";

import { useActionState } from "react";

import type {
  AuthActionState,
  AuthFormAction,
} from "../types";

const INITIAL_STATE: AuthActionState = {};

export function useAuthFormState(action: AuthFormAction) {
  return useActionState(action, INITIAL_STATE);
}
