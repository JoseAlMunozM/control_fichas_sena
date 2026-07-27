export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta extends PaginationParams {
  totalItems: number;
  totalPages: number;
}
