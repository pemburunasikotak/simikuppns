import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TSubmittedIndicatorsResponse,
  TApprovalActionPayload,
} from "./type";

export const getSubmittedIndicators = async (
  params?: Record<string, unknown>
): Promise<TSubmittedIndicatorsResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/indicators/submitted", {
    params,
  });
  return data;
};

export const getApprovedIndicators = async (
  params?: Record<string, unknown>
): Promise<TSubmittedIndicatorsResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/indicators/indicator-approved", {
    params,
  });
  return data;
};

export const approveIndicator = async (
  id: string,
  payload: TApprovalActionPayload
): Promise<{ isSuccess: boolean; message?: string; data?: unknown }> => {
  const { data } = await prokerAxiosInstance.post(
    `/api/v1/indicators/${id}/approve`,
    payload
  );
  return data;
};

export const rejectIndicator = async (
  id: string,
  payload: TApprovalActionPayload
): Promise<{ isSuccess: boolean; message?: string; data?: unknown }> => {
  const { data } = await prokerAxiosInstance.post(
    `/api/v1/indicators/${id}/reject`,
    payload
  );
  return data;
};

export const revisionIndicator = async (
  id: string,
  payload: TApprovalActionPayload
): Promise<{ isSuccess: boolean; message?: string; data?: unknown }> => {
  const { data } = await prokerAxiosInstance.post(
    `/api/v1/indicators/${id}/revision`,
    payload
  );
  return data;
};
