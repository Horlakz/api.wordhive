export interface PaginationResponseDto<T> {
  results: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
