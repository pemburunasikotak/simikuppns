import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TDefaultProgram,
  TDefaultProgramPayload,
  TDefaultProgramResponse,
  TProkerIkuListResponse,
} from "./type";

export const getListDefaultProgram = async (params?: Record<string, unknown>): Promise<TDefaultProgramResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/default-programs", { params });
  return data;
};

export const getDefaultProgramById = async (id: string): Promise<{ isSuccess: boolean; data: TDefaultProgram }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/default-programs/${id}`);
  return data;
};

export const createDefaultProgram = async (payload: TDefaultProgramPayload): Promise<{ isSuccess: boolean; data: TDefaultProgram }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/default-programs", payload);
  return data;
};

export const updateDefaultProgram = async (id: string, payload: TDefaultProgramPayload): Promise<{ isSuccess: boolean; data: TDefaultProgram }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/default-programs/${id}`, payload);
  return data;
};

export const deleteDefaultProgram = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/default-programs/${id}`);
  return;
};

export const getListIkuProker = async (params?: Record<string, unknown>): Promise<TProkerIkuListResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/ikus", { params });
  return data;
};
