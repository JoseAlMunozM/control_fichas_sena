"use server";

import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/authorization";
import {
  getUnexpectedActionMessage,
  getValidationErrorDetails,
} from "@/utils/action-errors";

import {
  prorrogaService,
  ProrrogaServiceError,
} from "../services";
import type {
  ProrrogaActionError,
  ProrrogaActionResult,
  ProrrogaResponse,
  ProrrogasResponse,
} from "../types";
import {
  createProrrogaSchema,
  prorrogaFiltersSchema,
  prorrogaIdSchema,
  resolveProrrogaSchema,
  updateProrrogaSchema,
} from "../validators";

function getActor(session: Session) {
  return {
    id: session.user.id,
    nombre:
      session.user.name ?? session.user.email ?? "Instructor líder",
  };
}

const VALIDATION_FIELD_LABELS = {
  fichaId: "Ficha",
  fechaFinLectivaNueva: "Nuevo fin de etapa lectiva",
  fechaFinPracticaNueva: "Nuevo fin de etapa práctica",
  motivo: "Motivo de la prórroga",
  estado: "Decisión",
  observacionRespuesta: "Observación de la decisión",
} as const;

function mapActionError(error: unknown): ProrrogaActionError {
  if (error instanceof z.ZodError) {
    const details = getValidationErrorDetails(
      error,
      "Revisa los datos de la prórroga y corrige los campos señalados.",
      VALIDATION_FIELD_LABELS,
    );

    return {
      code: "VALIDATION_ERROR",
      ...details,
    };
  }

  if (error instanceof ProrrogaServiceError) {
    return { code: error.code, message: error.message };
  }

  return {
    code: "INTERNAL_ERROR",
    message: getUnexpectedActionMessage(
      error,
      "Ocurrió un error inesperado al procesar la prórroga. Actualiza la página e inténtalo nuevamente.",
    ),
  };
}

async function executeProrrogaAction<Value>(
  operation: (session: Session) => Promise<Value>,
): Promise<ProrrogaActionResult<Value>> {
  const session = await requireAuth();

  try {
    return { success: true, value: await operation(session) };
  } catch (error) {
    return { success: false, error: mapActionError(error) };
  }
}

function revalidateProrrogaPaths(fichaId?: string): void {
  revalidatePath("/prorrogas");
  revalidatePath("/fichas");
  revalidatePath("/dashboard");
  if (fichaId) revalidatePath(`/fichas/${fichaId}`);
}

export async function findAllProrrogasAction(
  input: unknown = {},
): Promise<ProrrogaActionResult<ProrrogasResponse>> {
  return executeProrrogaAction(async () =>
    prorrogaService.findAll(prorrogaFiltersSchema.parse(input)),
  );
}

export async function createProrrogaAction(
  input: unknown,
): Promise<ProrrogaActionResult<ProrrogaResponse>> {
  return executeProrrogaAction(async (session) => {
    const data = createProrrogaSchema.parse(input);
    const response = await prorrogaService.create(data, getActor(session));

    revalidateProrrogaPaths(response.data.fichaId);

    return response;
  });
}

export async function updateProrrogaAction(
  idInput: unknown,
  dataInput: unknown,
): Promise<ProrrogaActionResult<ProrrogaResponse>> {
  return executeProrrogaAction(async () => {
    const id = prorrogaIdSchema.parse(idInput);
    const data = updateProrrogaSchema.parse(dataInput);
    const response = await prorrogaService.update(id, data);

    revalidateProrrogaPaths(response.data.fichaId);

    return response;
  });
}

export async function resolveProrrogaAction(
  idInput: unknown,
  dataInput: unknown,
): Promise<ProrrogaActionResult<ProrrogaResponse>> {
  return executeProrrogaAction(async (session) => {
    const id = prorrogaIdSchema.parse(idInput);
    const data = resolveProrrogaSchema.parse(dataInput);
    const response = await prorrogaService.resolve(
      id,
      data,
      getActor(session),
    );

    revalidateProrrogaPaths(response.data.fichaId);

    return response;
  });
}

export async function deleteProrrogaAction(
  input: unknown,
): Promise<ProrrogaActionResult<ProrrogaResponse>> {
  return executeProrrogaAction(async () => {
    const id = prorrogaIdSchema.parse(input);
    const response = await prorrogaService.delete(id);

    revalidateProrrogaPaths(response.data.fichaId);

    return response;
  });
}
