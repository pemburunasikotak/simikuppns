import { api } from "@/libs/axios/api";
import { TGetMetricsParams, TMetricsListResponse, TMetricDetailResponse } from "./type";

export const getListMetrics = async (
  params?: TGetMetricsParams,
): Promise<TMetricsListResponse> => {
  const res = await api.get("/api/realizations/metrics", { params });
  const responseData = res.data;

  // Transform data to match TResponsePaginate structure
  if (responseData.data && !responseData.result) {
    const dataObj = responseData.data;
    const pagination = dataObj.pagination;

    const currentPage = pagination?.page || dataObj.current_page || 1;
    const totalPage = pagination?.totalPages || dataObj.last_page || 1;

    responseData.result = {
      data: dataObj.data || [],
      total: pagination?.total || dataObj.total || 0,
      currentPage: currentPage,
      totalPage: totalPage,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPage,
    };
  }

  return responseData;
};

export const getMetricDetail = async (
  type: string,
  id: string,
): Promise<TMetricDetailResponse> => {
  const res = await api.get(`/api/realizations/${type.toLowerCase()}/${id}/view`);
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    responseData.result = responseData.data;
  }
  return responseData;
};
