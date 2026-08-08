import { z } from "zod";

import { DIA_SEMANA, SEGUIMIENTO_ESTADO } from "../constants";
import type {
  CreateProgramacionDto,
  UpdateSeguimientoEstadoDto,
} from "../types";

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora no es válida.");

export const seguimientoIdSchema = z.uuid(
  "El identificador del seguimiento no es válido.",
);

export const programacionIdSchema = z.uuid(
  "El identificador de la programación no es válido.",
);

export const createProgramacionSchema = z
  .object({
    instructorId: z.uuid("Selecciona un instructor válido."),
    fechaInicio: z.iso.date("La fecha inicial no es válida."),
    fechaFin: z.iso.date("La fecha final no es válida."),
    bloques: z
      .array(
        z
          .object({
            dia: z.enum([
              DIA_SEMANA.LUNES,
              DIA_SEMANA.MARTES,
              DIA_SEMANA.MIERCOLES,
              DIA_SEMANA.JUEVES,
              DIA_SEMANA.VIERNES,
              DIA_SEMANA.SABADO,
              DIA_SEMANA.DOMINGO,
            ]),
            horaInicio: timeSchema,
            horaFin: timeSchema,
          })
          .strict(),
      )
      .min(1, "Agrega al menos un bloque horario."),
  })
  .strict()
  .superRefine((data, context) => {
    if (data.fechaFin < data.fechaInicio) {
      context.addIssue({
        code: "custom",
        path: ["fechaFin"],
        message: "La fecha final debe ser posterior a la fecha inicial.",
      });
    }

    data.bloques.forEach((block, index) => {
      if (block.horaFin <= block.horaInicio) {
        context.addIssue({
          code: "custom",
          path: ["bloques", index, "horaFin"],
          message: "La hora final debe ser posterior a la inicial.",
        });
      }
    });
  }) satisfies z.ZodType<CreateProgramacionDto>;

export const updateProgramacionSchema = createProgramacionSchema;

export const updateSeguimientoEstadoSchema = z
  .object({
    estado: z.enum([
      SEGUIMIENTO_ESTADO.PENDIENTE,
      SEGUIMIENTO_ESTADO.PROGRAMADA,
      SEGUIMIENTO_ESTADO.EN_EJECUCION,
      SEGUIMIENTO_ESTADO.FINALIZADA,
      SEGUIMIENTO_ESTADO.SUSPENDIDA,
      SEGUIMIENTO_ESTADO.CANCELADA,
    ]),
  })
  .strict() satisfies z.ZodType<UpdateSeguimientoEstadoDto>;
