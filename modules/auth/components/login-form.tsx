"use client";

import { Button, Input } from "@/components/ui";

import { loginAction } from "../actions";
import { useAuthFormState } from "../hooks";

export function LoginForm() {
  const [state, action, isPending] = useAuthFormState(loginAction);

  return (
    <form action={action} className="space-y-5">
      {state.message ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {state.message}
        </p>
      ) : null}
      <Input
        autoComplete="email"
        disabled={isPending}
        error={state.fieldErrors?.correo?.[0]}
        label="Correo institucional"
        name="correo"
        required
        type="email"
      />
      <Input
        autoComplete="current-password"
        disabled={isPending}
        error={state.fieldErrors?.password?.[0]}
        label="Contraseña"
        name="password"
        required
        type="password"
      />
      <Button
        className="w-full"
        isLoading={isPending}
        loadingText="Ingresando..."
        type="submit"
      >
        Ingresar
      </Button>
    </form>
  );
}
