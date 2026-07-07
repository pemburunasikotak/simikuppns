import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerProgress, TProkerProgressPayload, TProkerProgressResponse } from "./type";

export const getListProgress = async (params?: Record<string, unknown>): Promise<TProkerProgressResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/progress", { params });
  return data;
};

export const getProgressById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerProgress }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/progress/${id}`);
  return data;
};

export const createProgress = async (payload: TProkerProgressPayload): Promise<{ isSuccess: boolean; data: TProkerProgress }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/progress", payload);
  return data;
};

export const updateProgress = async (id: string, payload: TProkerProgressPayload): Promise<{ isSuccess: boolean; data: TProkerProgress }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/progress/${id}`, payload);
  return data;
};

export const deleteProgress = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/progress/${id}`);
  return;
};
