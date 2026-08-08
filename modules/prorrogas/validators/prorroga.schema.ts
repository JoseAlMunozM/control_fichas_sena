import { z } from "zod";

import { PAGE_SIZE_OPTIONS } from "@/constants";

import {
  PRORROGA_ESTADO,
  PRORROGA_FIELD_LIMITS,
} from "../constants";
import type {
  CreateProrrogaDto,
  ProrrogaFilters,
  ResolveProrrogaDto,
  UpdateProrrogaDto,
} from "../types";

const dateSchema = z.iso.date("La fecha no es válida.");

const extensionFields = {
  fechaFinLectivaNueva: dateSchema,
  fechaFinPracticaNueva: dateSchema,
  motivo: z
    .string()
    .trim()
    .min(3, "El motivo debe tener al menos 3 caracteres.")
    .max(PRORROGA_FIELD_LIMITS.motivo),
};

function validateDates(
  data: {
    fechaFinLectivaNueva: string;
    fechaFinPracticaNueva: string;
  },
  context: z.RefinementCtx,
) {
  if (data.fechaFinPracticaNueva < data.fechaFinLectivaNueva) {
    context.addIssue({
      code: "custom",
      path: ["fechaFinPracticaNueva"],
      message: "El fin práctico debe ser posterior al nuevo fin lectivo.",
    });
  }
}

export const prorrogaIdSchema = z.uuid(
  "El identificador de la prórroga no es válido.",
);

export const createProrrogaSchema = z
  .object({
    fichaId: z.uuid("Selecciona una ficha válida."),
    ...extensionFields,
  })
  .strict()
  .superRefine(validateDates) satisfies z.ZodType<CreateProrrogaDto>;

export const updateProrrogaSchema = z
  .object(extensionFields)
  .strict()
  .superRefine(validateDates) satisfies z.ZodType<UpdateProrrogaDto>;

export const resolveProrrogaSchema = z
  .object({
    estado: z.enum([
      PRORROGA_ESTADO.APROBADA,
      PRORROGA_ESTADO.RECHAZADA,
    ]),
    observacionRespuesta: z
      .string()
      .trim()
      .max(PRORROGA_FIELD_LIMITS.observacionRespuesta)
      .nullable()
      .optional(),
  })
  .strict() satisfies z.ZodType<ResolveProrrogaDto>;

export const prorrogaFiltersSchema = z
  .object({
    search: z.string().trim().max(150).optional(),
    estado: z
      .enum([
        PRORROGA_ESTADO.PENDIENTE,
        PRORROGA_ESTADO.APROBADA,
        PRORROGA_ESTADO.RECHAZADA,
      ])
      .optional(),
    fichaId: z.uuid().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z
      .number()
      .int()
      .positive()
      .max(Math.max(...PAGE_SIZE_OPTIONS))
      .optional(),
  })
  .strict() satisfies z.ZodType<ProrrogaFilters>;
