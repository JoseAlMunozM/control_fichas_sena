import type { DiaSemana } from "./ficha.entity";

export interface CreateFichaDto {
  numero: string;
  programaId: string;
  planId: string;
  municipio: string;
  sede?: string | null;
  modalidad?: string | null;
  diasFormacion: DiaSemana[];
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  fechaFinLectiva: string;
  fechaFinPractica: string;
  observaciones?: string | null;
}
