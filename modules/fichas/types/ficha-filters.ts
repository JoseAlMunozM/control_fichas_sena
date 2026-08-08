import type { PaginationParams } from "@/types";

import type { FichaEstado } from "./ficha.entity";

export interface FichaFilters extends Partial<PaginationParams> {
  search?: string;
  programaId?: string;
  estado?: FichaEstado;
}
