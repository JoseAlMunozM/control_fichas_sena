"use client";

import { Button, Input } from "@/components/ui";

import { setupAction } from "../actions";
import { useAuthFormState } from "../hooks";

export function SetupForm() {
  const [state, action, isPending] = useAuthFormState(setupAction);

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
        autoComplete="name"
        disabled={isPending}
        error={state.fieldErrors?.nombre?.[0]}
        label="Nombre completo"
        name="nombre"
        required
      />
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
        autoComplete="new-password"
        disabled={isPending}
        error={state.fieldErrors?.password?.[0]}
        helperText="Mínimo 10 caracteres, con mayúscula, minúscula y número."
        label="Contraseña"
        name="password"
        required
        type="password"
      />
      <Input
        autoComplete="new-password"
        disabled={isPending}
        error={state.fieldErrors?.confirmarPassword?.[0]}
        label="Confirmar contraseña"
        name="confirmarPassword"
        required
        type="password"
      />
      <Button
        className="w-full"
        isLoading={isPending}
        loadingText="Configurando..."
        type="submit"
      >
        Crear cuenta inicial
      </Button>
    </form>
  );
}
