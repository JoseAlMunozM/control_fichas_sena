import type { ProgramaEntity } from "./programa.entity";

export type CreateProgramaDto = Pick<
  ProgramaEntity,
  "codigo" | "nombre"
> &
  Partial<
    Pick<ProgramaEntity, "descripcion" | "estado">
  >;
