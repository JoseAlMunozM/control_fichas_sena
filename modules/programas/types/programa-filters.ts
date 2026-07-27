import type { PaginationParams } from "@/types";

export interface ProgramaFilters extends Partial<PaginationParams> {
  search?: string;
  codigo?: string;
  nombre?: string;
  estado?: boolean;
}
