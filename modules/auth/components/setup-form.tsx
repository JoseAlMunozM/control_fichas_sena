"use client";

import { Alert, Button, Input } from "@/components/ui";

import { setupAction } from "../actions";
import { useAuthFormState } from "../hooks";

export function SetupForm() {
  const [state, action, isPending] = useAuthFormState(setupAction);

  return (
    <form action={action} className="space-y-5">
      {state.message ? (
        <Alert title="No se pudo crear la cuenta inicial">
          {state.message}
        </Alert>
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
