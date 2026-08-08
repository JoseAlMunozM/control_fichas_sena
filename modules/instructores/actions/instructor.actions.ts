"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/authorization";

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
  createInstructorSchema,
  instructorFiltersSchema,
  instructorIdSchema,
  updateInstructorSchema,
} from "../validators";

function mapError(error: unknown): InstructorActionError {
  if (error instanceof z.ZodError) {
    const flattened = z.flattenError(error);

    return {
      code: "VALIDATION_ERROR",
      message: flattened.formErrors[0] ?? "Los datos no son válidos.",
      fieldErrors: flattened.fieldErrors,
    };
  }

  if (error instanceof InstructorServiceError) {
    return { code: error.code, message: error.message };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "No fue posible completar la operación.",
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
