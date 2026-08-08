import { z } from "zod";

import { PAGE_SIZE_OPTIONS } from "@/constants";

import { INSTRUCTOR_FIELD_LIMITS } from "../constants";
import type {
  CreateInstructorDto,
  InstructorFilters,
  UpdateInstructorDto,
} from "../types";

const nullableText = (maximum: number) =>
  z.string().trim().max(maximum).nullable().optional();

export const instructorIdSchema = z.uuid(
  "El identificador del instructor no es válido.",
);

export const createInstructorSchema = z
  .object({
    nombre: z.string().trim().min(3).max(INSTRUCTOR_FIELD_LIMITS.nombre),
    correo: z
      .email("El correo institucional no es válido.")
      .trim()
      .max(INSTRUCTOR_FIELD_LIMITS.correo)
      .transform((value) => value.toLocaleLowerCase("es")),
    telefono: nullableText(INSTRUCTOR_FIELD_LIMITS.telefono),
    estado: z.boolean().optional(),
    observaciones: nullableText(INSTRUCTOR_FIELD_LIMITS.observaciones),
  })
  .strict() satisfies z.ZodType<CreateInstructorDto>;

export const updateInstructorSchema =
  createInstructorSchema.partial() satisfies z.ZodType<UpdateInstructorDto>;

export const instructorFiltersSchema = z
  .object({
    search: z.string().trim().max(150).optional(),
    estado: z.boolean().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z
      .number()
      .int()
      .positive()
      .max(Math.max(...PAGE_SIZE_OPTIONS))
      .optional(),
  })
  .strict() satisfies z.ZodType<InstructorFilters>;
