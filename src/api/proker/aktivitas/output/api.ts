import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerOutput, TProkerOutputPayload, TProkerOutputResponse } from "./type";

export const getListOutputs = async (activityId: string, params?: Record<string, unknown>): Promise<TProkerOutputResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/activities/${activityId}/outputs`, { params });
  return data;
};

export const createOutput = async (activityId: string, payload: TProkerOutputPayload): Promise<{ isSuccess: boolean; data: TProkerOutput }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/activities/${activityId}/outputs`, payload);
  return data;
};

export const updateOutput = async (activityId: string, id: string, payload: TProkerOutputPayload): Promise<{ isSuccess: boolean; data: TProkerOutput }> => {
  console.log('ID', activityId)
  const { data } = await prokerAxiosInstance.put(`/api/v1/outputs/${id}`, payload);
  return data;
};

export const deleteOutput = async (activityId: string, id: string): Promise<unknown> => {
  console.log('ID', activityId)
  await prokerAxiosInstance.delete(`/api/v1/outputs/${id}`);
  return;
};
