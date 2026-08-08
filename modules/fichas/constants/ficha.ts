import type {
  DiaSemana,
  FichaEstado,
  SeguimientoCompetenciaEstado,
} from "../types";

export const FICHA_ESTADO = {
  PLANEADA: "PLANEADA",
  EN_FORMACION: "EN_FORMACION",
  ETAPA_PRACTICA: "ETAPA_PRACTICA",
  FINALIZADA: "FINALIZADA",
  CANCELADA: "CANCELADA",
} as const satisfies Record<string, FichaEstado>;

export const FICHA_ESTADO_LABELS = {
  [FICHA_ESTADO.PLANEADA]: "Planeada",
  [FICHA_ESTADO.EN_FORMACION]: "En formación",
  [FICHA_ESTADO.ETAPA_PRACTICA]: "Etapa práctica",
  [FICHA_ESTADO.FINALIZADA]: "Finalizada",
  [FICHA_ESTADO.CANCELADA]: "Cancelada",
} as const satisfies Record<FichaEstado, string>;

export const SEGUIMIENTO_ESTADO = {
  PENDIENTE: "PENDIENTE",
  PROGRAMADA: "PROGRAMADA",
  EN_EJECUCION: "EN_EJECUCION",
  FINALIZADA: "FINALIZADA",
  SUSPENDIDA: "SUSPENDIDA",
  CANCELADA: "CANCELADA",
} as const satisfies Record<string, SeguimientoCompetenciaEstado>;

export const SEGUIMIENTO_ESTADO_LABELS = {
  [SEGUIMIENTO_ESTADO.PENDIENTE]: "Pendiente",
  [SEGUIMIENTO_ESTADO.PROGRAMADA]: "Programada",
  [SEGUIMIENTO_ESTADO.EN_EJECUCION]: "En ejecución",
  [SEGUIMIENTO_ESTADO.FINALIZADA]: "Finalizada",
  [SEGUIMIENTO_ESTADO.SUSPENDIDA]: "Suspendida",
  [SEGUIMIENTO_ESTADO.CANCELADA]: "Cancelada",
} as const satisfies Record<SeguimientoCompetenciaEstado, string>;

export const DIA_SEMANA = {
  LUNES: "LUNES",
  MARTES: "MARTES",
  MIERCOLES: "MIERCOLES",
  JUEVES: "JUEVES",
  VIERNES: "VIERNES",
  SABADO: "SABADO",
  DOMINGO: "DOMINGO",
} as const satisfies Record<string, DiaSemana>;

export const DIA_SEMANA_LABELS = {
  [DIA_SEMANA.LUNES]: "Lunes",
  [DIA_SEMANA.MARTES]: "Martes",
  [DIA_SEMANA.MIERCOLES]: "Miércoles",
  [DIA_SEMANA.JUEVES]: "Jueves",
  [DIA_SEMANA.VIERNES]: "Viernes",
  [DIA_SEMANA.SABADO]: "Sábado",
  [DIA_SEMANA.DOMINGO]: "Domingo",
} as const satisfies Record<DiaSemana, string>;

export const DEFAULT_DIAS_FORMACION: DiaSemana[] = [
  DIA_SEMANA.LUNES,
  DIA_SEMANA.MARTES,
  DIA_SEMANA.MIERCOLES,
  DIA_SEMANA.JUEVES,
  DIA_SEMANA.VIERNES,
];

export const FICHA_FIELD_LIMITS = {
  numero: 30,
  municipio: 100,
  sede: 150,
  modalidad: 100,
  observaciones: 1000,
} as const;
