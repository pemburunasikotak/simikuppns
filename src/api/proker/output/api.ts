import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerOutput, TProkerOutputPayload, TProkerOutputResponse } from "./type";

export const getListOutput = async (params?: Record<string, unknown>): Promise<TProkerOutputResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/outputs", { params });
  return data;
};

export const getOutputById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerOutput }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/outputs/${id}`);
  return data;
};

export const createOutput = async (payload: TProkerOutputPayload): Promise<{ isSuccess: boolean; data: TProkerOutput }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/outputs", payload);
  return data;
};

export const updateOutput = async (id: string, payload: TProkerOutputPayload): Promise<{ isSuccess: boolean; data: TProkerOutput }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/outputs/${id}`, payload);
  return data;
};

export const deleteOutput = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/outputs/${id}`);
  return;
};
