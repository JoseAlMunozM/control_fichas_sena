import type { PaginationMeta, PaginationParams } from "@/types";

import type { ProrrogaDto } from "./prorroga.dto";
import type { ProrrogaEstado } from "./prorroga.entity";

export interface ProrrogaFilters extends Partial<PaginationParams> {
  search?: string;
  estado?: ProrrogaEstado;
  fichaId?: string;
}

export interface ProrrogaResponse {
  data: ProrrogaDto;
}

export interface ProrrogasResponse {
  data: readonly ProrrogaDto[];
  pagination: PaginationMeta;
}
