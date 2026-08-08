import type { CompetenciaTipo } from "../types";

export const COMPETENCIA_TIPO = {
  TECNICA: "TECNICA",
  TRANSVERSAL: "TRANSVERSAL",
  PRACTICA: "PRACTICA",
} as const satisfies Record<string, CompetenciaTipo>;

export const COMPETENCIA_TIPO_LABELS = {
  [COMPETENCIA_TIPO.TECNICA]: "Técnica",
  [COMPETENCIA_TIPO.TRANSVERSAL]: "Transversal",
  [COMPETENCIA_TIPO.PRACTICA]: "Etapa práctica",
} as const satisfies Record<CompetenciaTipo, string>;

export const PLAN_FIELD_LIMITS = {
  version: { min: 1, max: 30 },
  norma: { min: 3, max: 500 },
  nombre: { min: 2, max: 150 },
  horas: { min: 1, max: 5000 },
} as const;

export const PLAN_VALIDATION_MESSAGES = {
  version: {
    required: "La versión del plan es obligatoria.",
    maximum: `La versión no puede superar ${PLAN_FIELD_LIMITS.version.max} caracteres.`,
  },
  norma: {
    minimum: `La norma debe tener al menos ${PLAN_FIELD_LIMITS.norma.min} caracteres.`,
    maximum: `La norma no puede superar ${PLAN_FIELD_LIMITS.norma.max} caracteres.`,
  },
  nombre: {
    minimum: `El nombre debe tener al menos ${PLAN_FIELD_LIMITS.nombre.min} caracteres.`,
    maximum: `El nombre no puede superar ${PLAN_FIELD_LIMITS.nombre.max} caracteres.`,
  },
  horas: {
    invalid: "Las horas deben ser un número entero mayor que cero.",
    maximum: `Las horas no pueden superar ${PLAN_FIELD_LIMITS.horas.max}.`,
  },
} as const;
