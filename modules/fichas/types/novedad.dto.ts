import type { NovedadCompetenciaTipo } from "./ficha.entity";

export interface CreateNovedadCompetenciaDto {
  fecha: string;
  tipo: NovedadCompetenciaTipo;
  descripcion: string;
}

export type UpdateNovedadCompetenciaDto = CreateNovedadCompetenciaDto;
