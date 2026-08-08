import type { PlanFormacionEntity } from "./plan-formacion.entity";

export interface ProgramaEntity {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  planes: PlanFormacionEntity[];
  createdAt: Date;
  updatedAt: Date;
}
