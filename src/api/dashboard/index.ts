import { api } from "@/libs/axios/api";
import {
  TTransactionFilter,
  TTransactionPaginateResponse,
  TDashboardIKUResponse,
} from "./type";

export const getListTransaction = (params: TTransactionFilter): Promise<TTransactionPaginateResponse> => {
  console.error('MASUK', params);
  return Promise.resolve({
    code: 1,
    message: "success",
    status: true,
    result: {
      data: [
        {
          id: "1",
          name: "John Doe",
          no_whatapps: "1234567890",
          package: "Wedding Package A",
          event_date: "2023-10-01",
          updated_at: "2023-10-02T12:00:00Z",
          total: "1000000",
        },
      ],
      currentPage: 1,
      total: 1,
      totalPage: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
};

export const getDashboardIKU = async (params: { year: number }): Promise<TDashboardIKUResponse> => {
  const res = await api.get("/api/dashboard/iku", { params });
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    responseData.result = responseData.data;
  }
  return responseData;
};

export const getDashboardSummary = async (params: { year: number }): Promise<import('./type').TDashboardSummaryResponse> => {
  const res = await api.get("/api/dashboard/summary", { params });
  return res.data;
};