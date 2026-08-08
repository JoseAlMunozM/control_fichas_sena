import type {
  FichaEntity,
  FichaSeguimientoEntity,
  NovedadCompetenciaEntity,
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
  "programaciones" | "novedades"
> & {
  programaciones: readonly ProgramacionCompetenciaDto[];
  novedades: readonly NovedadCompetenciaDto[];
};

export type NovedadCompetenciaDto = Omit<
  NovedadCompetenciaEntity,
  "fecha" | "createdAt" | "updatedAt"
> & {
  fecha: string;
  createdAt: string;
  updatedAt: string;
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
