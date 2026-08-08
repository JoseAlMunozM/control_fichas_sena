import type { PlanCompetenciaEntity } from "./plan-competencia.entity";

export interface PlanFormacionEntity {
  id: string;
  version: string;
  estado: boolean;
  competencias: PlanCompetenciaEntity[];
  createdAt: Date;
  updatedAt: Date;
}
