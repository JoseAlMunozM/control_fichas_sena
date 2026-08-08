import type { PlanFormacionEntity } from "./plan-formacion.entity";

export type PlanFormacionDto = Omit<
  PlanFormacionEntity,
  "createdAt" | "updatedAt"
> & {
  totalHoras: number;
  createdAt: string;
  updatedAt: string;
};
