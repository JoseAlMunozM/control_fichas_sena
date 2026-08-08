export type CompetenciaTipo =
  | "TECNICA"
  | "TRANSVERSAL"
  | "PRACTICA";

export interface PlanCompetenciaEntity {
  id: string;
  norma: string;
  nombre: string;
  tipo: CompetenciaTipo;
  horas: number;
  orden: number;
}
