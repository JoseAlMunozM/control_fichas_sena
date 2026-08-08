import { z } from "zod";

import { PAGE_SIZE_OPTIONS } from "@/constants";

import {
  DIA_SEMANA,
  FICHA_ESTADO,
  FICHA_FIELD_LIMITS,
} from "../constants";
import type {
  CreateFichaDto,
  FichaFilters,
  UpdateFichaDto,
} from "../types";

const dateSchema = z.iso.date("La fecha no es válida.");
const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora no es válida.");

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).nullable().optional();

const fichaFields = {
  numero: z.string().trim().min(1).max(FICHA_FIELD_LIMITS.numero),
  programaId: z.uuid(),
  planId: z.uuid(),
  municipio: z.string().trim().min(2).max(FICHA_FIELD_LIMITS.municipio),
  sede: optionalText(FICHA_FIELD_LIMITS.sede),
  modalidad: optionalText(FICHA_FIELD_LIMITS.modalidad),
  diasFormacion: z
    .array(
      z.enum([
        DIA_SEMANA.LUNES,
        DIA_SEMANA.MARTES,
        DIA_SEMANA.MIERCOLES,
        DIA_SEMANA.JUEVES,
        DIA_SEMANA.VIERNES,
        DIA_SEMANA.SABADO,
        DIA_SEMANA.DOMINGO,
      ]),
    )
    .min(1, "Selecciona al menos un día de formación."),
  horaInicio: timeSchema,
  horaFin: timeSchema,
  fechaInicio: dateSchema,
  fechaFinLectiva: dateSchema,
  fechaFinPractica: dateSchema,
  observaciones: optionalText(FICHA_FIELD_LIMITS.observaciones),
};

function validateSchedule(
  data: {
    horaInicio?: string;
    horaFin?: string;
    fechaInicio?: string;
    fechaFinLectiva?: string;
    fechaFinPractica?: string;
  },
  context: z.RefinementCtx,
) {
  if (
    data.horaInicio !== undefined &&
    data.horaFin !== undefined &&
    data.horaFin <= data.horaInicio
  ) {
    context.addIssue({
      code: "custom",
      path: ["horaFin"],
      message: "La hora final debe ser posterior a la hora inicial.",
    });
  }

  if (
    data.fechaInicio !== undefined &&
    data.fechaFinLectiva !== undefined &&
    data.fechaFinLectiva < data.fechaInicio
  ) {
    context.addIssue({
      code: "custom",
      path: ["fechaFinLectiva"],
      message: "El fin lectivo debe ser posterior al inicio.",
    });
  }

  if (
    data.fechaFinLectiva !== undefined &&
    data.fechaFinPractica !== undefined &&
    data.fechaFinPractica < data.fechaFinLectiva
  ) {
    context.addIssue({
      code: "custom",
      path: ["fechaFinPractica"],
      message: "El fin práctico debe ser posterior al fin lectivo.",
    });
  }
}

export const fichaIdSchema = z.uuid(
  "El identificador de la ficha no es válido.",
);

export const createFichaSchema = z
  .object(fichaFields)
  .strict()
  .superRefine(validateSchedule) satisfies z.ZodType<CreateFichaDto>;

export const updateFichaSchema = z
  .object({
    numero: fichaFields.numero.optional(),
    municipio: fichaFields.municipio.optional(),
    sede: fichaFields.sede,
    modalidad: fichaFields.modalidad,
    diasFormacion: fichaFields.diasFormacion.optional(),
    horaInicio: fichaFields.horaInicio.optional(),
    horaFin: fichaFields.horaFin.optional(),
    fechaInicio: fichaFields.fechaInicio.optional(),
    fechaFinLectiva: fichaFields.fechaFinLectiva.optional(),
    fechaFinPractica: fichaFields.fechaFinPractica.optional(),
    observaciones: fichaFields.observaciones,
    estado: z
      .enum([
        FICHA_ESTADO.PLANEADA,
        FICHA_ESTADO.EN_FORMACION,
        FICHA_ESTADO.ETAPA_PRACTICA,
        FICHA_ESTADO.FINALIZADA,
        FICHA_ESTADO.CANCELADA,
      ])
      .optional(),
  })
  .strict()
  .superRefine(validateSchedule) satisfies z.ZodType<UpdateFichaDto>;

export const fichaFiltersSchema = z
  .object({
    search: z.string().trim().max(150).optional(),
    programaId: z.uuid().optional(),
    estado: z
      .enum([
        FICHA_ESTADO.PLANEADA,
        FICHA_ESTADO.EN_FORMACION,
        FICHA_ESTADO.ETAPA_PRACTICA,
        FICHA_ESTADO.FINALIZADA,
        FICHA_ESTADO.CANCELADA,
      ])
      .optional(),
    page: z.number().int().positive().optional(),
    pageSize: z
      .number()
      .int()
      .positive()
      .max(Math.max(...PAGE_SIZE_OPTIONS))
      .optional(),
  })
  .strict() satisfies z.ZodType<FichaFilters>;
