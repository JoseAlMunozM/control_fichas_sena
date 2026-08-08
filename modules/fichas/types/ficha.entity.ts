import type { CompetenciaTipo } from "@/modules/programas/types";

export type FichaEstado =
  | "PLANEADA"
  | "EN_FORMACION"
  | "ETAPA_PRACTICA"
  | "FINALIZADA"
  | "CANCELADA";

export type SeguimientoCompetenciaEstado =
  | "PENDIENTE"
  | "PROGRAMADA"
  | "EN_EJECUCION"
  | "FINALIZADA"
  | "SUSPENDIDA"
  | "CANCELADA";

export type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO";

export interface FichaSeguimientoEntity {
  id: string;
  competenciaId: string;
  competenciaNombre: string;
  competenciaNorma: string;
  competenciaTipo: CompetenciaTipo;
  horasPlan: number;
  orden: number;
  estado: SeguimientoCompetenciaEstado;
  programaciones: ProgramacionCompetenciaEntity[];
}

export interface ProgramacionBloqueEntity {
  id: string;
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface ProgramacionCompetenciaEntity {
  id: string;
  instructorId: string;
  instructorNombre: string;
  instructorCorreo: string;
  fechaInicio: Date;
  fechaFin: Date;
  bloques: ProgramacionBloqueEntity[];
  horasProgramadas: number;
  registradoPorId: string;
  registradoPorNombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FichaEntity {
  id: string;
  numero: string;
  programaId: string;
  programaCodigo: string;
  programaNombre: string;
  planId: string;
  planVersion: string;
  municipio: string;
  sede: string | null;
  modalidad: string | null;
  diasFormacion: DiaSemana[];
  horaInicio: string;
  horaFin: string;
  fechaInicio: Date;
  fechaFinLectiva: Date;
  fechaFinPractica: Date;
  estado: FichaEstado;
  instructorLiderId: string;
  instructorLiderNombre: string;
  observaciones: string | null;
  seguimientos: FichaSeguimientoEntity[];
  createdAt: Date;
  updatedAt: Date;
}
