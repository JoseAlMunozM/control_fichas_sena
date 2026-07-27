import type { ProgramaEntity } from "./programa.entity";

export type ProgramaDto = Omit<
  ProgramaEntity,
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};
