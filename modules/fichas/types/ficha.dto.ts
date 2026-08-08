import type {
  FichaEntity,
  FichaSeguimientoEntity,
  ProgramacionCompetenciaEntity,
} from "./ficha.entity";

export type ProgramacionCompetenciaDto = Omit<
  ProgramacionCompetenciaEntity,
  "fechaInicio" | "fechaFin" | "createdAt" | "updatedAt"
> & {
  fechaInicio: string;
  fechaFin: string;
  createdAt: string;
  updatedAt: string;
};

export type FichaSeguimientoDto = Omit<
  FichaSeguimientoEntity,
  "programaciones"
> & {
  programaciones: readonly ProgramacionCompetenciaDto[];
};

export type FichaDto = Omit<
  FichaEntity,
  | "fechaInicio"
  | "fechaFinLectiva"
  | "fechaFinPractica"
  | "seguimientos"
  | "createdAt"
  | "updatedAt"
> & {
  fechaInicio: string;
  fechaFinLectiva: string;
  fechaFinPractica: string;
  seguimientos: readonly FichaSeguimientoDto[];
  createdAt: string;
  updatedAt: string;
};
