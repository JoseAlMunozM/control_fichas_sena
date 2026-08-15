import type { InstructorEntity } from "./instructor.entity";

export type CreateInstructorDto = Pick<
  InstructorEntity,
  "nombre" | "correo"
> &
  Partial<Pick<InstructorEntity, "telefono" | "observaciones">> & {
    fechaInicioContrato: string;
    fechaFinContrato: string;
  };

export type UpdateInstructorDto = Partial<
  Pick<
    InstructorEntity,
    "nombre" | "correo" | "telefono" | "observaciones"
  >
>;

export interface CreateContratoInstructorDto {
  fechaInicio: string;
  fechaFin: string;
}
