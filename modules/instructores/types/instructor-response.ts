import type { PaginationMeta, PaginationParams } from "@/types";

import type { InstructorDto } from "./instructor.dto";

export interface InstructorFilters extends Partial<PaginationParams> {
  search?: string;
  estado?: boolean;
}

export interface InstructorResponse {
  data: InstructorDto;
}

export interface InstructoresResponse {
  data: readonly InstructorDto[];
  pagination: PaginationMeta;
}
