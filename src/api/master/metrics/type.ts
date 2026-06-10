import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TMetricIKU = {
  id: string;
  code: string;
  name: string;
};

export type TMetricTag = {
  id: string;
  name: string;
  color?: string;
  deletedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type TMetricItem = {
  id: string;
  type: string;
  code: string;
  name: string;
  description: string;
  dataType: string | null;
  sourceType: string | null;
  periodType: string;
  tags: TMetricTag[];
  ikus: TMetricIKU[];
  createdAt: string;
  updatedAt: string;
  unit: string;
  hasBreakdown?: boolean;
};

export type TMetricTarget = {
  id: string;
  targetYear: string | number;
  targetQ1: string | number;
  targetQ2: string | number;
  targetQ3: string | number;
  targetQ4: string | number;
  createdAt: string;
  updatedAt: string;
};

export type TMetricRealization = {
  id: string;
  month: number;
  value: string | number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type TMetricYearData = {
  year: number;
  target: TMetricTarget | null;
  realizations: TMetricRealization[];
};

export type TMetricDetail = {
  metric: TMetricItem & { unit?: string; isDirectInput?: boolean };
  years: number[];
  data: TMetricYearData[];
};

export type TMetricDetailResponse = TResponse<TMetricDetail>;

export type TGetMetricsParams = {
  page?: number;
  limit?: number;
  name?: string;
  tag?: string;
};

export type TMetricsListResponse = TResponsePaginate<TMetricItem>;
