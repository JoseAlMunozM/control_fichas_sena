import type { CreateFichaDto } from "./create-ficha.dto";
import type { FichaEstado } from "./ficha.entity";

export type UpdateFichaDto = Partial<
  Omit<CreateFichaDto, "programaId" | "planId">
> & {
  estado?: FichaEstado;
};
