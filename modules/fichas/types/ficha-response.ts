import type { PaginationMeta } from "@/types";

import type { FichaDto } from "./ficha.dto";

export interface FichaResponse {
  data: FichaDto;
}

export interface FichasResponse {
  data: readonly FichaDto[];
  pagination: PaginationMeta;
}
