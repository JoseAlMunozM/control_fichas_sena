"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/authorization";
import {
  getUnexpectedActionMessage,
  getValidationErrorDetails,
} from "@/utils/action-errors";

import {
  instructorService,
  InstructorServiceError,
} from "../services";
import type {
  InstructorActionError,
  InstructorActionResult,
  InstructorResponse,
  InstructoresResponse,
} from "../types";
import {
  createContratoInstructorSchema,
  createInstructorSchema,
  instructorFiltersSchema,
  instructorIdSchema,
  updateInstructorSchema,
} from "../validators";

const VALIDATION_FIELD_LABELS = {
  nombre: "Nombre completo",
  correo: "Correo institucional",
  telefono: "Teléfono",
  observaciones: "Observaciones",
  fechaInicioContrato: "Inicio del contrato",
  fechaFinContrato: "Finalización del contrato",
  fechaInicio: "Inicio del nuevo contrato",
  fechaFin: "Finalización del nuevo contrato",
} as const;

function mapError(error: unknown): InstructorActionError {
  if (error instanceof z.ZodError) {
    const details = getValidationErrorDetails(
      error,
      "Revisa los datos del instructor y corrige los campos señalados.",
      VALIDATION_FIELD_LABELS,
    );

    return {
      code: "VALIDATION_ERROR",
      ...details,
    };
  }

  if (error instanceof InstructorServiceError) {
    return { code: error.code, message: error.message };
  }

  return {
    code: "INTERNAL_ERROR",
    message: getUnexpectedActionMessage(
      error,
      "Ocurrió un error inesperado al procesar el instructor. Actualiza la página e inténtalo nuevamente.",
    ),
  };
}

async function execute<Value>(
  operation: () => Promise<Value>,
): Promise<InstructorActionResult<Value>> {
  await requireAuth();

  try {
    return { success: true, value: await operation() };
  } catch (error) {
    return { success: false, error: mapError(error) };
  }
}

export async function findAllInstructoresAction(
  input: unknown = {},
): Promise<InstructorActionResult<InstructoresResponse>> {
  return execute(() =>
    instructorService.findAll(instructorFiltersSchema.parse(input)),
  );
}

export async function createInstructorAction(
  input: unknown,
): Promise<InstructorActionResult<InstructorResponse>> {
  return execute(async () => {
    const response = await instructorService.create(
      createInstructorSchema.parse(input),
    );
    revalidatePath("/instructores");

    return response;
  });
}

export async function updateInstructorAction(
  idInput: unknown,
  dataInput: unknown,
): Promise<InstructorActionResult<InstructorResponse>> {
  return execute(async () => {
    const response = await instructorService.update(
      instructorIdSchema.parse(idInput),
      updateInstructorSchema.parse(dataInput),
    );
    revalidatePath("/instructores");

    return response;
  });
}

export async function addInstructorContractAction(
  instructorIdInput: unknown,
  dataInput: unknown,
): Promise<InstructorActionResult<InstructorResponse>> {
  return execute(async () => {
    const response = await instructorService.addContract(
      instructorIdSchema.parse(instructorIdInput),
      createContratoInstructorSchema.parse(dataInput),
    );

    revalidatePath("/instructores");
    revalidatePath("/fichas");
    revalidatePath("/dashboard");

    return response;
  });
}

export async function deleteInstructorAction(
  input: unknown,
): Promise<InstructorActionResult<InstructorResponse>> {
  return execute(async () => {
    const response = await instructorService.delete(
      instructorIdSchema.parse(input),
    );
    revalidatePath("/instructores");

    return response;
  });
}
