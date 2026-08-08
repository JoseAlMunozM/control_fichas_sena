import type { ProrrogaEntity } from "./prorroga.entity";

export type ProrrogaDto = Omit<
  ProrrogaEntity,
  | "fechaInicio"
  | "fechaFinLectivaAnterior"
  | "fechaFinPracticaAnterior"
  | "fechaFinLectivaNueva"
  | "fechaFinPracticaNueva"
  | "resolvedAt"
  | "createdAt"
  | "updatedAt"
> & {
  fechaInicio: string;
  fechaFinLectivaAnterior: string;
  fechaFinPracticaAnterior: string;
  fechaFinLectivaNueva: string;
  fechaFinPracticaNueva: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
