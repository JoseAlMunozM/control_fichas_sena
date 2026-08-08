import type {
  DiaSemana,
  SeguimientoCompetenciaEstado,
} from "./ficha.entity";

export interface CreateProgramacionBloqueDto {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface CreateProgramacionDto {
  instructorId: string;
  fechaInicio: string;
  fechaFin: string;
  bloques: CreateProgramacionBloqueDto[];
}

export type UpdateProgramacionDto = CreateProgramacionDto;

export interface UpdateSeguimientoEstadoDto {
  estado: SeguimientoCompetenciaEstado;
}
