import type {
  DiaSemana,
  FichaEstado,
  SeguimientoCompetenciaEstado,
} from "@/modules/fichas/types";
import type { CompetenciaTipo } from "@/modules/programas/types";
import type { ProrrogaEstado } from "@/modules/prorrogas/types";

export interface DashboardScheduleDto {
  id: string;
  instructorNombre: string;
  fechaInicio: string;
  fechaFin: string;
  bloques: readonly {
    id: string;
    dia: DiaSemana;
    horaInicio: string;
    horaFin: string;
  }[];
}

export interface DashboardCompetenciaDto {
  key: string;
  nombre: string;
  tipo: CompetenciaTipo;
  estado: SeguimientoCompetenciaEstado;
  horasPlan: number;
  horasProgramadas: number;
  horasPendientes: number;
  novedades: number;
  programaciones: readonly DashboardScheduleDto[];
}

export interface DashboardFichaDto {
  id: string;
  numero: string;
  programaId: string;
  programaCodigo: string;
  programaNombre: string;
  planVersion: string;
  municipio: string;
  sede: string | null;
  diasFormacion: readonly DiaSemana[];
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  fechaFinLectiva: string;
  fechaFinPractica: string;
  estado: FichaEstado;
  instructorLiderNombre: string;
  observaciones: string | null;
  competencias: readonly DashboardCompetenciaDto[];
  totalNovedades: number;
  prorroga: {
    estado: ProrrogaEstado;
    fechaFinLectivaNueva: string;
    fechaFinPracticaNueva: string;
  } | null;
}

export interface DashboardDataDto {
  fichas: readonly DashboardFichaDto[];
}
