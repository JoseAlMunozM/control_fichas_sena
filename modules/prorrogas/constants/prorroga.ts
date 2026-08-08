import type { ProrrogaEstado } from "../types";

export const PRORROGA_ESTADO = {
  PENDIENTE: "PENDIENTE",
  APROBADA: "APROBADA",
  RECHAZADA: "RECHAZADA",
} as const satisfies Record<string, ProrrogaEstado>;

export const PRORROGA_ESTADO_LABELS = {
  [PRORROGA_ESTADO.PENDIENTE]: "Pendiente",
  [PRORROGA_ESTADO.APROBADA]: "Aprobada",
  [PRORROGA_ESTADO.RECHAZADA]: "Rechazada",
} as const satisfies Record<ProrrogaEstado, string>;

export const PRORROGA_FIELD_LIMITS = {
  motivo: 1000,
  observacionRespuesta: 1000,
} as const;
