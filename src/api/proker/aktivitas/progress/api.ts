import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerProgress, TProkerProgressPayload, TProkerProgressResponse } from "./type";

export const getListProgress = async (activityId: string, params?: Record<string, unknown>): Promise<TProkerProgressResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/activities/${activityId}/progress`, { params });
  return data;
};

export const createProgress = async (activityId: string, payload: TProkerProgressPayload): Promise<{ isSuccess: boolean; data: TProkerProgress }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/activities/${activityId}/progress`, payload);
  return data;
};
