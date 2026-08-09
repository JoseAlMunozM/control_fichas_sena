import type { JornadaFormacion } from "./ficha.entity";

export interface CreateFichaDto {
  numero: string;
  programaId: string;
  planId: string;
  municipio: string;
  sede?: string | null;
  modalidad?: string | null;
  jornadas: JornadaFormacion[];
  fechaInicio: string;
  fechaFinLectiva: string;
  fechaFinPractica: string;
  observaciones?: string | null;
}
