import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TProkerMasterBudget,
  TCreateMasterBudgetPayload,
  TUpdateMasterBudgetTotalPayload,
  TUpdateMasterBudgetRealizationPayload,
  TProkerMasterBudgetResponse,
} from "./type";

export const getMasterBudgets = async (
  params?: Record<string, unknown>
): Promise<TProkerMasterBudgetResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/master-budgets", { params });
  return data;
};

export const getMasterBudgetByYear = async (
  year: number | string
): Promise<TProkerMasterBudget> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/master-budgets/${year}`);
  return data?.data || data;
};

export const createMasterBudget = async (
  payload: TCreateMasterBudgetPayload
): Promise<TProkerMasterBudget> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/master-budgets", payload);
  return data?.data || data;
};

export const deleteMasterBudget = async (
  year: number | string
): Promise<void> => {
  await prokerAxiosInstance.delete(`/api/v1/master-budgets/${year}`);
};

export const updateMasterBudgetTotal = async (
  year: number | string,
  payload: TUpdateMasterBudgetTotalPayload
): Promise<TProkerMasterBudget> => {
  const { data } = await prokerAxiosInstance.patch(
    `/api/v1/master-budgets/${year}/budget`,
    payload
  );
  return data?.data || data;
};

export const updateMasterBudgetRealization = async (
  year: number | string,
  payload: TUpdateMasterBudgetRealizationPayload
): Promise<TProkerMasterBudget> => {
  const { data } = await prokerAxiosInstance.patch(
    `/api/v1/master-budgets/${year}/realization`,
    payload
  );
  return data?.data || data;
};
