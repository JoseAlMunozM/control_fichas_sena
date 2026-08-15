import { z } from "zod";

import { PAGE_SIZE_OPTIONS } from "@/constants";

import { INSTRUCTOR_FIELD_LIMITS } from "../constants";
import type {
  CreateContratoInstructorDto,
  CreateInstructorDto,
  InstructorFilters,
  UpdateInstructorDto,
} from "../types";

const nullableText = (maximum: number) =>
  z.string().trim().max(maximum).nullable().optional();

const contractDateSchema = z.iso.date("La fecha no es válida.");

export const createContratoInstructorSchema = z
  .object({
    fechaInicio: contractDateSchema,
    fechaFin: contractDateSchema,
  })
  .strict()
  .refine((data) => data.fechaFin >= data.fechaInicio, {
    message: "La fecha final debe ser igual o posterior a la fecha inicial.",
    path: ["fechaFin"],
  }) satisfies z.ZodType<CreateContratoInstructorDto>;

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
    observaciones: nullableText(INSTRUCTOR_FIELD_LIMITS.observaciones),
    fechaInicioContrato: contractDateSchema,
    fechaFinContrato: contractDateSchema,
  })
  .strict()
  .refine(
    (data) => data.fechaFinContrato >= data.fechaInicioContrato,
    {
      message:
        "La fecha final debe ser igual o posterior a la fecha inicial.",
      path: ["fechaFinContrato"],
    },
  ) satisfies z.ZodType<CreateInstructorDto>;

export const updateInstructorSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3)
      .max(INSTRUCTOR_FIELD_LIMITS.nombre)
      .optional(),
    correo: z
      .email("El correo institucional no es válido.")
      .trim()
      .max(INSTRUCTOR_FIELD_LIMITS.correo)
      .transform((value) => value.toLocaleLowerCase("es"))
      .optional(),
    telefono: nullableText(INSTRUCTOR_FIELD_LIMITS.telefono),
    observaciones: nullableText(INSTRUCTOR_FIELD_LIMITS.observaciones),
  })
  .strict() satisfies z.ZodType<UpdateInstructorDto>;

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
