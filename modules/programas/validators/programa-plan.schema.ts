import { z } from "zod";

import {
  COMPETENCIA_TIPO,
  PLAN_FIELD_LIMITS,
  PLAN_VALIDATION_MESSAGES,
} from "../constants";
import type {
  CreatePlanCompetenciaDto,
  CreatePlanFormacionDto,
  UpdatePlanCompetenciaDto,
  UpdatePlanFormacionDto,
} from "../types";

export const planIdSchema = z.uuid(
  "El identificador del plan no es válido.",
);

export const planCompetenciaIdSchema = z.uuid(
  "El identificador de la competencia no es válido.",
);

export const createPlanFormacionSchema = z
  .object({
    version: z
      .string()
      .trim()
      .min(
        PLAN_FIELD_LIMITS.version.min,
        PLAN_VALIDATION_MESSAGES.version.required,
      )
      .max(
        PLAN_FIELD_LIMITS.version.max,
        PLAN_VALIDATION_MESSAGES.version.maximum,
      ),
    estado: z.boolean().optional(),
  })
  .strict() satisfies z.ZodType<CreatePlanFormacionDto>;

export const updatePlanFormacionSchema =
  createPlanFormacionSchema.partial() satisfies z.ZodType<UpdatePlanFormacionDto>;

export const createPlanCompetenciaSchema = z
  .object({
    norma: z
      .string()
      .trim()
      .min(
        PLAN_FIELD_LIMITS.norma.min,
        PLAN_VALIDATION_MESSAGES.norma.minimum,
      )
      .max(
        PLAN_FIELD_LIMITS.norma.max,
        PLAN_VALIDATION_MESSAGES.norma.maximum,
      ),
    nombre: z
      .string()
      .trim()
      .min(
        PLAN_FIELD_LIMITS.nombre.min,
        PLAN_VALIDATION_MESSAGES.nombre.minimum,
      )
      .max(
        PLAN_FIELD_LIMITS.nombre.max,
        PLAN_VALIDATION_MESSAGES.nombre.maximum,
      ),
    tipo: z.enum([
      COMPETENCIA_TIPO.TECNICA,
      COMPETENCIA_TIPO.TRANSVERSAL,
      COMPETENCIA_TIPO.PRACTICA,
    ]),
    horas: z
      .number(PLAN_VALIDATION_MESSAGES.horas.invalid)
      .int(PLAN_VALIDATION_MESSAGES.horas.invalid)
      .min(
        PLAN_FIELD_LIMITS.horas.min,
        PLAN_VALIDATION_MESSAGES.horas.invalid,
      )
      .max(
        PLAN_FIELD_LIMITS.horas.max,
        PLAN_VALIDATION_MESSAGES.horas.maximum,
      ),
  })
  .strict() satisfies z.ZodType<CreatePlanCompetenciaDto>;

export const updatePlanCompetenciaSchema =
  createPlanCompetenciaSchema.partial() satisfies z.ZodType<UpdatePlanCompetenciaDto>;
