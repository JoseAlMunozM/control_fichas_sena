import { z } from "zod";

import {
  NOVEDAD_COMPETENCIA_TIPO,
  NOVEDAD_FIELD_LIMITS,
} from "../constants";
import type { CreateNovedadCompetenciaDto } from "../types";

const descriptionSchema = z
  .string()
  .trim()
  .min(3, "La descripción debe tener al menos 3 caracteres.")
  .max(NOVEDAD_FIELD_LIMITS.descripcion);

export const novedadIdSchema = z.uuid(
  "El identificador de la novedad no es válido.",
);

export const createNovedadCompetenciaSchema = z
  .object({
    fecha: z.iso.date("La fecha no es válida."),
    tipo: z.enum([
      NOVEDAD_COMPETENCIA_TIPO.OBSERVACION,
      NOVEDAD_COMPETENCIA_TIPO.REPROGRAMACION,
      NOVEDAD_COMPETENCIA_TIPO.CAMBIO_INSTRUCTOR,
      NOVEDAD_COMPETENCIA_TIPO.SUSPENSION,
      NOVEDAD_COMPETENCIA_TIPO.OTRA,
    ]),
    descripcion: descriptionSchema,
  })
  .strict() satisfies z.ZodType<CreateNovedadCompetenciaDto>;

export const updateNovedadCompetenciaSchema =
  createNovedadCompetenciaSchema;
