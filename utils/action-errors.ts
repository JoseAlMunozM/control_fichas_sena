import { z } from "zod";

export type ValidationFieldLabels = Readonly<Record<string, string>>;

export interface ValidationErrorDetails {
  message: string;
  fieldErrors: Readonly<
    Record<string, readonly string[] | undefined>
  >;
}

const DATABASE_ERROR_MESSAGES = {
  P1000:
    "La aplicación no pudo autenticarse con la base de datos. Contacta al soporte técnico para revisar la conexión.",
  P1001:
    "La base de datos no está disponible en este momento. Verifica tu conexión e inténtalo nuevamente; si continúa, contacta al soporte técnico.",
  P1002:
    "La base de datos tardó demasiado en responder. Espera unos segundos e inténtalo nuevamente.",
  P1008:
    "La operación agotó el tiempo de espera de la base de datos. Espera unos segundos y vuelve a intentarlo.",
  P1017:
    "Se perdió la conexión con la base de datos. Actualiza la página e inténtalo nuevamente.",
  P2002:
    "No se puede guardar porque ya existe otro registro con un dato que debe ser único. Revisa códigos, correos, versiones o números repetidos.",
  P2003:
    "No se puede eliminar este registro porque tiene información relacionada. Para conservar el histórico, utiliza Inactivo, Cancelada o Finalizada según corresponda.",
  P2014:
    "La acción rompería una relación necesaria entre registros. Conserva el registro y cambia su estado en lugar de eliminarlo.",
  P2024:
    "La base de datos está atendiendo demasiadas solicitudes. Espera unos segundos e inténtalo nuevamente.",
  P2025:
    "El registro ya no existe o cambió desde que abriste la pantalla. Actualiza la página y vuelve a realizar la acción.",
} as const;

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    typeof error.code !== "string"
  ) {
    return undefined;
  }

  return error.code;
}

function getFirstIssueMessage(
  error: z.ZodError,
  fieldLabels: ValidationFieldLabels,
  fallback: string,
): string {
  const issue = error.issues[0];

  if (!issue) return fallback;

  if (issue.code === "unrecognized_keys") {
    return "El formulario está desactualizado o contiene campos no reconocidos. Actualiza la página y vuelve a intentarlo.";
  }

  const field = issue.path[0];
  const label =
    typeof field === "string" ? fieldLabels[field] ?? field : undefined;

  return label ? `${label}: ${issue.message}` : issue.message || fallback;
}

export function getValidationErrorDetails(
  error: z.ZodError,
  fallback: string,
  fieldLabels: ValidationFieldLabels = {},
): ValidationErrorDetails {
  const flattened = z.flattenError(error);

  return {
    message:
      flattened.formErrors[0] ??
      getFirstIssueMessage(error, fieldLabels, fallback),
    fieldErrors: flattened.fieldErrors,
  };
}

export function getUnexpectedActionMessage(
  error: unknown,
  fallback: string,
): string {
  return getKnownInfrastructureErrorMessage(error) ?? fallback;
}

export function getKnownInfrastructureErrorMessage(
  error: unknown,
): string | undefined {
  const code = getErrorCode(error);

  return code && code in DATABASE_ERROR_MESSAGES
    ? DATABASE_ERROR_MESSAGES[code as keyof typeof DATABASE_ERROR_MESSAGES]
    : undefined;
}
