import type { InstructorEntity } from "./instructor.entity";

export type CreateInstructorDto = Pick<
  InstructorEntity,
  "nombre" | "correo"
> &
  Partial<
    Pick<InstructorEntity, "telefono" | "estado" | "observaciones">
  >;

export type UpdateInstructorDto = Partial<CreateInstructorDto>;
