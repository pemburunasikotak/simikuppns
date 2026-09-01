import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TRejectedIndicatorsResponse } from "./type";

export const getRejectedIndicators = async (
  params?: Record<string, unknown>
): Promise<TRejectedIndicatorsResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/indicators/rejected", {
    params,
  });
  return data;
};
