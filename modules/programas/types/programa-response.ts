import type { PaginationMeta } from "@/types";

import type { ProgramaDto } from "./programa.dto";

export interface ProgramaResponse {
  data: ProgramaDto;
}

export interface ProgramasResponse {
  data: readonly ProgramaDto[];
  pagination: PaginationMeta;
}
