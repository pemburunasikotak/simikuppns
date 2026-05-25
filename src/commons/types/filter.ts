export type TFilterParams<T = Record<string, unknown>> = {
  page?: number;
  per_page?: number;
  search?: string;
  search_value?: string;
  sort?: string;
  order?: "ASC" | "DESC";
} & T;
