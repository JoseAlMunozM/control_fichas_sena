import type { ContratoInstructorEntity } from "./contrato-instructor.entity";

export type ContratoInstructorDto = Omit<
  ContratoInstructorEntity,
  "fechaInicio" | "fechaFin" | "createdAt" | "updatedAt"
> & {
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  updatedAt: string;
};
