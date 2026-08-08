import type { PlanFormacionEntity } from "./plan-formacion.entity";

export type CreatePlanFormacionDto = Pick<
  PlanFormacionEntity,
  "version"
> &
  Partial<Pick<PlanFormacionEntity, "estado">>;

export type UpdatePlanFormacionDto =
  Partial<CreatePlanFormacionDto>;
