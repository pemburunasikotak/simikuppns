import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TRevisionIndicatorsResponse,
  TReviseIndicatorPayload,
} from "./type";

export const getRevisionIndicators = async (
  params?: Record<string, unknown>
): Promise<TRevisionIndicatorsResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/indicators/revision", {
    params,
  });
  return data;
};

export const reviseIndicator = async (
  id: string,
  payload: TReviseIndicatorPayload
): Promise<{ isSuccess: boolean; message?: string; data?: unknown }> => {
  const { data } = await prokerAxiosInstance.post(
    `/api/v1/indicators/${id}/revise`,
    payload
  );
  return data;
};
