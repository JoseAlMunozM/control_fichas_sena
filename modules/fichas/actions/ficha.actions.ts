"use server";

import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/authorization";

import {
  fichaService,
  FichaServiceError,
} from "../services";
import type {
  FichaActionError,
  FichaActionResult,
  FichaResponse,
  FichasResponse,
} from "../types";
import {
  createNovedadCompetenciaSchema,
  createProgramacionSchema,
  createFichaSchema,
  fichaFiltersSchema,
  fichaIdSchema,
  novedadIdSchema,
  programacionIdSchema,
  seguimientoIdSchema,
  updateFichaSchema,
  updateNovedadCompetenciaSchema,
  updateProgramacionSchema,
  updateSeguimientoEstadoSchema,
} from "../validators";

function getLeaderIdentity(session: Session) {
  return {
    id: session.user.id,
    nombre:
      session.user.name ?? session.user.email ?? "Instructor líder",
  };
}

function mapActionError(error: unknown): FichaActionError {
  if (error instanceof z.ZodError) {
    const flattened = z.flattenError(error);

    return {
      code: "VALIDATION_ERROR",
      message: flattened.formErrors[0] ?? "Los datos no son válidos.",
      fieldErrors: flattened.fieldErrors,
    };
  }

  if (error instanceof FichaServiceError) {
    return { code: error.code, message: error.message };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "No fue posible completar la operación.",
  };
}

async function executeFichaAction<Value>(
  operation: (session: Session) => Promise<Value>,
): Promise<FichaActionResult<Value>> {
  const session = await requireAuth();

  try {
    return { success: true, value: await operation(session) };
  } catch (error) {
    return { success: false, error: mapActionError(error) };
  }
}

function revalidateFichaPaths(fichaId?: string): void {
  revalidatePath("/fichas");
  if (fichaId) revalidatePath(`/fichas/${fichaId}`);
}

export async function findAllFichasAction(
  input: unknown = {},
): Promise<FichaActionResult<FichasResponse>> {
  return executeFichaAction(async () =>
    fichaService.findAll(fichaFiltersSchema.parse(input)),
  );
}

export async function createFichaAction(
  input: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async (session) => {
    const data = createFichaSchema.parse(input);
    const response = await fichaService.create(
      data,
      getLeaderIdentity(session),
    );

    revalidateFichaPaths(response.data.id);

    return response;
  });
}

export async function updateFichaAction(
  idInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const id = fichaIdSchema.parse(idInput);
    const data = updateFichaSchema.parse(dataInput);
    const response = await fichaService.update(id, data);

    revalidateFichaPaths(id);

    return response;
  });
}

export async function deleteFichaAction(
  input: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const id = fichaIdSchema.parse(input);
    const response = await fichaService.delete(id);

    revalidateFichaPaths();

    return response;
  });
}

export async function createProgramacionAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async (session) => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const data = createProgramacionSchema.parse(dataInput);
    const response = await fichaService.createProgramacion(
      fichaId,
      seguimientoId,
      data,
      getLeaderIdentity(session),
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function updateProgramacionAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  programacionIdInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const programacionId = programacionIdSchema.parse(programacionIdInput);
    const data = updateProgramacionSchema.parse(dataInput);
    const response = await fichaService.updateProgramacion(
      fichaId,
      seguimientoId,
      programacionId,
      data,
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function deleteProgramacionAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  programacionIdInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const programacionId = programacionIdSchema.parse(programacionIdInput);
    const response = await fichaService.deleteProgramacion(
      fichaId,
      seguimientoId,
      programacionId,
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function updateSeguimientoEstadoAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const data = updateSeguimientoEstadoSchema.parse(dataInput);
    const response = await fichaService.updateSeguimientoEstado(
      fichaId,
      seguimientoId,
      data,
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function createNovedadAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async (session) => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const data = createNovedadCompetenciaSchema.parse(dataInput);
    const response = await fichaService.createNovedad(
      fichaId,
      seguimientoId,
      data,
      getLeaderIdentity(session),
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function updateNovedadAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  novedadIdInput: unknown,
  dataInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const novedadId = novedadIdSchema.parse(novedadIdInput);
    const data = updateNovedadCompetenciaSchema.parse(dataInput);
    const response = await fichaService.updateNovedad(
      fichaId,
      seguimientoId,
      novedadId,
      data,
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}

export async function deleteNovedadAction(
  fichaIdInput: unknown,
  seguimientoIdInput: unknown,
  novedadIdInput: unknown,
): Promise<FichaActionResult<FichaResponse>> {
  return executeFichaAction(async () => {
    const fichaId = fichaIdSchema.parse(fichaIdInput);
    const seguimientoId = seguimientoIdSchema.parse(seguimientoIdInput);
    const novedadId = novedadIdSchema.parse(novedadIdInput);
    const response = await fichaService.deleteNovedad(
      fichaId,
      seguimientoId,
      novedadId,
    );

    revalidateFichaPaths(fichaId);

    return response;
  });
}
