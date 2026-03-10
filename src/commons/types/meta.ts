type TMetaPage = {
  page?: number;
  perPage?: number;
};

export type TMetaResponse = TMetaPage & {
  pageSize?: number;
  total?: number;
};

export type TMetaRequest<T = unknown> = TMetaPage & {
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  orderBy?: string;
  filters?: T;
};
