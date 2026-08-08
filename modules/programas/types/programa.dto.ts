import type { PlanFormacionDto } from "./plan-formacion.dto";
import type { ProgramaEntity } from "./programa.entity";

export type ProgramaDto = Omit<
  ProgramaEntity,
  "createdAt" | "updatedAt" | "planes"
> & {
  planes: readonly PlanFormacionDto[];
  createdAt: string;
  updatedAt: string;
};
