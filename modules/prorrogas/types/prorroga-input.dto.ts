import type { ProrrogaEstado } from "./prorroga.entity";

export interface CreateProrrogaDto {
  fichaId: string;
  fechaFinLectivaNueva: string;
  fechaFinPracticaNueva: string;
  motivo: string;
}

export type UpdateProrrogaDto = Omit<CreateProrrogaDto, "fichaId">;

export interface ResolveProrrogaDto {
  estado: Extract<ProrrogaEstado, "APROBADA" | "RECHAZADA">;
  observacionRespuesta?: string | null;
}
