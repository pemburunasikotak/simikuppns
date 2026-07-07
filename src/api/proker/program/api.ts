import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerProgram, TProkerProgramPayload, TProkerProgramResponse } from "./type";

export const getListProgram = async (params?: Record<string, unknown>): Promise<TProkerProgramResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/programs", { params });
  return data;
};

export const getProgramById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerProgram }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${id}`);
  return data;
};

export const createProgram = async (payload: TProkerProgramPayload): Promise<{ isSuccess: boolean; data: TProkerProgram }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/programs", payload);
  return data;
};

export const updateProgram = async (id: string, payload: TProkerProgramPayload): Promise<{ isSuccess: boolean; data: TProkerProgram }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/programs/${id}`, payload);
  return data;
};

export const deleteProgram = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/programs/${id}`);
  return;
};
