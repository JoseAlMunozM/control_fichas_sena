import { z } from "zod";

import { PAGE_SIZE_OPTIONS } from "@/constants";

import {
  PROGRAMA_FIELD_LIMITS,
  PROGRAMA_QUERY_VALIDATION_MESSAGES,
  PROGRAMA_VALIDATION_MESSAGES,
} from "../constants";
import type {
  CreateProgramaDto,
  ProgramaFilters,
  UpdateProgramaDto,
} from "../types";

export const programaCodigoSchema = z
  .string(PROGRAMA_VALIDATION_MESSAGES.codigo.invalidType)
  .trim()
  .min(
    PROGRAMA_FIELD_LIMITS.codigo.min,
    PROGRAMA_VALIDATION_MESSAGES.codigo.required,
  )
  .max(
    PROGRAMA_FIELD_LIMITS.codigo.max,
    PROGRAMA_VALIDATION_MESSAGES.codigo.maxLength,
  );

export const programaNombreSchema = z
  .string(PROGRAMA_VALIDATION_MESSAGES.nombre.invalidType)
  .trim()
  .min(1, PROGRAMA_VALIDATION_MESSAGES.nombre.required)
  .min(
    PROGRAMA_FIELD_LIMITS.nombre.min,
    PROGRAMA_VALIDATION_MESSAGES.nombre.minLength,
  )
  .max(
    PROGRAMA_FIELD_LIMITS.nombre.max,
    PROGRAMA_VALIDATION_MESSAGES.nombre.maxLength,
  );

export const programaDescripcionSchema = z
  .string(PROGRAMA_VALIDATION_MESSAGES.descripcion.invalidType)
  .trim()
  .max(
    PROGRAMA_FIELD_LIMITS.descripcion.max,
    PROGRAMA_VALIDATION_MESSAGES.descripcion.maxLength,
  )
  .nullable();

export const programaEstadoSchema = z.boolean(
  PROGRAMA_VALIDATION_MESSAGES.estado.invalidType,
);

export const programaSchema = z
  .object({
    codigo: programaCodigoSchema,
    nombre: programaNombreSchema,
    descripcion: programaDescripcionSchema,
    estado: programaEstadoSchema,
  })
  .strict();

export const createProgramaSchema = programaSchema.extend({
  descripcion: programaDescripcionSchema.optional(),
  estado: programaEstadoSchema.optional(),
}) satisfies z.ZodType<CreateProgramaDto>;

export const updateProgramaSchema =
  createProgramaSchema.partial() satisfies z.ZodType<UpdateProgramaDto>;

export const programaIdSchema = z.uuid(
  PROGRAMA_QUERY_VALIDATION_MESSAGES.id.invalid,
);

export const programaSearchSchema = z
  .string(PROGRAMA_QUERY_VALIDATION_MESSAGES.search.invalidType)
  .trim()
  .min(1, PROGRAMA_QUERY_VALIDATION_MESSAGES.search.required)
  .max(
    PROGRAMA_FIELD_LIMITS.nombre.max,
    PROGRAMA_QUERY_VALIDATION_MESSAGES.search.maxLength,
  );

export const programaFiltersSchema = z
  .object({
    search: z
      .string(PROGRAMA_QUERY_VALIDATION_MESSAGES.search.invalidType)
      .trim()
      .max(
        PROGRAMA_FIELD_LIMITS.nombre.max,
        PROGRAMA_QUERY_VALIDATION_MESSAGES.search.maxLength,
      )
      .optional(),
    codigo: z
      .string(PROGRAMA_VALIDATION_MESSAGES.codigo.invalidType)
      .trim()
      .max(
        PROGRAMA_FIELD_LIMITS.codigo.max,
        PROGRAMA_VALIDATION_MESSAGES.codigo.maxLength,
      )
      .optional(),
    nombre: z
      .string(PROGRAMA_VALIDATION_MESSAGES.nombre.invalidType)
      .trim()
      .max(
        PROGRAMA_FIELD_LIMITS.nombre.max,
        PROGRAMA_VALIDATION_MESSAGES.nombre.maxLength,
      )
      .optional(),
    estado: programaEstadoSchema.optional(),
    page: z
      .number(PROGRAMA_QUERY_VALIDATION_MESSAGES.page.invalidType)
      .int(PROGRAMA_QUERY_VALIDATION_MESSAGES.page.invalid)
      .positive(PROGRAMA_QUERY_VALIDATION_MESSAGES.page.invalid)
      .optional(),
    pageSize: z
      .number(
        PROGRAMA_QUERY_VALIDATION_MESSAGES.pageSize.invalidType,
      )
      .int(PROGRAMA_QUERY_VALIDATION_MESSAGES.pageSize.invalid)
      .positive(PROGRAMA_QUERY_VALIDATION_MESSAGES.pageSize.invalid)
      .max(
        Math.max(...PAGE_SIZE_OPTIONS),
        PROGRAMA_QUERY_VALIDATION_MESSAGES.pageSize.maximum,
      )
      .optional(),
  })
  .strict() satisfies z.ZodType<ProgramaFilters>;

export const programaSearchFiltersSchema =
  programaFiltersSchema.omit({
    search: true,
  }) satisfies z.ZodType<Omit<ProgramaFilters, "search">>;
