import type { PlanCompetenciaEntity } from "./plan-competencia.entity";

export type CreatePlanCompetenciaDto = Pick<
  PlanCompetenciaEntity,
  "norma" | "nombre" | "tipo" | "horas"
>;

export type UpdatePlanCompetenciaDto =
  Partial<CreatePlanCompetenciaDto>;
