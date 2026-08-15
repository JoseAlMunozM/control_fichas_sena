"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { AUTH_ROUTES } from "@/constants";
import { signIn, signOut } from "@/lib/auth";
import { getKnownInfrastructureErrorMessage } from "@/utils/action-errors";

import { AUTH_MESSAGES } from "../constants";
import {
  authService,
  AuthServiceError,
} from "../services";
import type { AuthActionState } from "../types";
import { loginSchema, setupSchema } from "../validators";

function mapError(error: unknown): AuthActionState {
  if (error instanceof z.ZodError) {
    const flattened = z.flattenError(error);

    return {
      message: flattened.formErrors[0],
      fieldErrors: flattened.fieldErrors,
    };
  }

  if (error instanceof AuthServiceError) {
    return { message: error.message };
  }

  if (error instanceof AuthError && error.type === "CredentialsSignin") {
    return { message: AUTH_MESSAGES.invalidCredentials };
  }

  return { message: AUTH_MESSAGES.genericError };
}

export async function loginAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    const data = loginSchema.parse({
      correo: formData.get("correo"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      correo: data.correo,
      password: data.password,
      redirectTo: AUTH_ROUTES.afterSignIn,
    });
  } catch (error) {
    if (error instanceof AuthError || error instanceof z.ZodError) {
      return mapError(error);
    }

    const infrastructureMessage =
      getKnownInfrastructureErrorMessage(error);

    if (infrastructureMessage) {
      return { message: infrastructureMessage };
    }

    throw error;
  }

  return {};
}

export async function setupAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    const data = setupSchema.parse({
      nombre: formData.get("nombre"),
      correo: formData.get("correo"),
      password: formData.get("password"),
      confirmarPassword: formData.get("confirmarPassword"),
    });
    await authService.createInitialUser(data);

    await signIn("credentials", {
      correo: data.correo,
      password: data.password,
      redirectTo: AUTH_ROUTES.afterSignIn,
    });
  } catch (error) {
    if (
      error instanceof AuthError ||
      error instanceof AuthServiceError ||
      error instanceof z.ZodError
    ) {
      return mapError(error);
    }

    const infrastructureMessage =
      getKnownInfrastructureErrorMessage(error);

    if (infrastructureMessage) {
      return { message: infrastructureMessage };
    }

    throw error;
  }

  return {};
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: AUTH_ROUTES.signIn });
}
