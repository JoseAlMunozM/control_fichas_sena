"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/authorization";
import {
  getUnexpectedActionMessage,
  getValidationErrorDetails,
} from "@/utils/action-errors";

import { PROGRAMA_ACTION_MESSAGES } from "../constants";
import {
  programaService,
  ProgramaServiceError,
} from "../services";
import type {
  ProgramaActionError,
  ProgramaActionResult,
  ProgramaResponse,
  ProgramasResponse,
} from "../types";
import {
  createProgramaSchema,
  createPlanCompetenciaSchema,
  createPlanFormacionSchema,
  planCompetenciaIdSchema,
  planIdSchema,
  programaFiltersSchema,
  programaIdSchema,
  programaSearchFiltersSchema,
  programaSearchSchema,
  updateProgramaSchema,
  updatePlanCompetenciaSchema,
  updatePlanFormacionSchema,
} from "../validators";

function revalidateProgramaPaths(programaId: string): void {
  revalidatePath("/programas");
  revalidatePath(`/programas/${programaId}`);
}

const VALIDATION_FIELD_LABELS = {
  codigo: "Código",
  nombre: "Nombre",
  descripcion: "Descripción",
  estado: "Estado",
  version: "Versión",
  norma: "Norma o descripción",
  tipo: "Tipo de competencia",
  horas: "Horas del plan",
} as const;

function mapActionError(error: unknown): ProgramaActionError {
  if (error instanceof z.ZodError) {
    const details = getValidationErrorDetails(
      error,
      PROGRAMA_ACTION_MESSAGES.validationError,
      VALIDATION_FIELD_LABELS,
    );

    return {
      code: "VALIDATION_ERROR",
      ...details,
    };
  }

  if (error instanceof ProgramaServiceError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: getUnexpectedActionMessage(
      error,
      "Ocurrió un error inesperado al procesar el programa. Actualiza la página e inténtalo nuevamente.",
    ),
  };
}

async function executeProgramaAction<Value>(
  operation: () => Promise<Value>,
): Promise<ProgramaActionResult<Value>> {
  await requireAuth();

  try {
    return {
      success: true,
      value: await operation(),
    };
  } catch (error) {
    return {
      success: false,
      error: mapActionError(error),
    };
  }
}

export async function findAllProgramasAction(
  input: unknown = {},
): Promise<ProgramaActionResult<ProgramasResponse>> {
  return executeProgramaAction(() => {
    const filters = programaFiltersSchema.parse(input);

    return programaService.findAll(filters);
  });
}

export async function findProgramaByIdAction(
  input: unknown,
): Promise<ProgramaActionResult<ProgramaResponse | null>> {
  return executeProgramaAction(() => {
    const id = programaIdSchema.parse(input);

    return programaService.findById(id);
  });
}

export async function createProgramaAction(
  input: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(() => {
    const data = createProgramaSchema.parse(input);

    return programaService.create(data);
  });
}

export async function createPlanFormacionAction(
  programaIdInput: unknown,
  dataInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const data = createPlanFormacionSchema.parse(dataInput);
    const response = await programaService.createPlan(programaId, data);

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function updatePlanFormacionAction(
  programaIdInput: unknown,
  planIdInput: unknown,
  dataInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const planId = planIdSchema.parse(planIdInput);
    const data = updatePlanFormacionSchema.parse(dataInput);
    const response = await programaService.updatePlan(
      programaId,
      planId,
      data,
    );

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function deletePlanFormacionAction(
  programaIdInput: unknown,
  planIdInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const planId = planIdSchema.parse(planIdInput);
    const response = await programaService.deletePlan(programaId, planId);

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function addPlanCompetenciaAction(
  programaIdInput: unknown,
  planIdInput: unknown,
  dataInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const planId = planIdSchema.parse(planIdInput);
    const data = createPlanCompetenciaSchema.parse(dataInput);
    const response = await programaService.addCompetencia(
      programaId,
      planId,
      data,
    );

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function updatePlanCompetenciaAction(
  programaIdInput: unknown,
  planIdInput: unknown,
  competenciaIdInput: unknown,
  dataInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const planId = planIdSchema.parse(planIdInput);
    const competenciaId = planCompetenciaIdSchema.parse(
      competenciaIdInput,
    );
    const data = updatePlanCompetenciaSchema.parse(dataInput);
    const response = await programaService.updateCompetencia(
      programaId,
      planId,
      competenciaId,
      data,
    );

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function removePlanCompetenciaAction(
  programaIdInput: unknown,
  planIdInput: unknown,
  competenciaIdInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(async () => {
    const programaId = programaIdSchema.parse(programaIdInput);
    const planId = planIdSchema.parse(planIdInput);
    const competenciaId = planCompetenciaIdSchema.parse(
      competenciaIdInput,
    );
    const response = await programaService.removeCompetencia(
      programaId,
      planId,
      competenciaId,
    );

    revalidateProgramaPaths(programaId);

    return response;
  });
}

export async function updateProgramaAction(
  idInput: unknown,
  dataInput: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(() => {
    const id = programaIdSchema.parse(idInput);
    const data = updateProgramaSchema.parse(dataInput);

    return programaService.update(id, data);
  });
}

export async function deleteProgramaAction(
  input: unknown,
): Promise<ProgramaActionResult<ProgramaResponse>> {
  return executeProgramaAction(() => {
    const id = programaIdSchema.parse(input);

    return programaService.delete(id);
  });
}

export async function searchProgramasAction(
  searchInput: unknown,
  filtersInput: unknown = {},
): Promise<ProgramaActionResult<ProgramasResponse>> {
  return executeProgramaAction(() => {
    const search = programaSearchSchema.parse(searchInput);
    const filters =
      programaSearchFiltersSchema.parse(filtersInput);

    return programaService.search(search, filters);
  });
}

export async function filterProgramasAction(
  input: unknown,
): Promise<ProgramaActionResult<ProgramasResponse>> {
  return executeProgramaAction(() => {
    const filters = programaFiltersSchema.parse(input);

    return programaService.filter(filters);
  });
}
