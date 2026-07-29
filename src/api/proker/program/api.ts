import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerProgram, TProkerProgramPayload, TProkerProgramResponse, TProkerProgramDetailResponse, TProgramActivityPayload } from "./type";
import { TProkerAktivitas } from "../aktivitas/type";

export const getListProgram = async (params?: Record<string, unknown>): Promise<TProkerProgramResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/programs", { params });
  return data;
};

export const getProgramById = async (id: string): Promise<TProkerProgramDetailResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${id}`);
  return data;
};

export const createProgram = async (payload: TProkerProgramPayload): Promise<{ isSuccess: boolean; data: TProkerProgram }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/programs", payload);
  return data;
};

export const updateProgram = async (id: string, payload: TProkerProgramPayload): Promise<{ isSuccess: boolean; data: TProkerProgram }> => {
  const { data } = await prokerAxiosInstance.patch(`/api/v1/programs/${id}`, payload);
  return data;
};

export const deleteProgram = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/programs/${id}`);
  return;
};

export const createProgramActivity = async (id: string, payload: TProgramActivityPayload): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${id}/activities`, payload);
  return data;
};

export const setProgramIndicatorTarget = async (programId: string, id: string, payload: import('./type').TSetProgramIndicatorTargetPayload): Promise<{ isSuccess: boolean; data: unknown }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${programId}/indicators/${id}/set-target`, payload);
  return data;
};

export const addIndicatorRealization = async (programId: string, id: string, payload: import('./type').TAddIndicatorRealizationPayload): Promise<{ isSuccess: boolean; data: unknown }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${programId}/indicators/${id}/realizations`, payload);
  return data;
};

export const getIndicatorRealizations = async (programId: string, id: string): Promise<{ isSuccess: boolean; data: import('./type').TIndicatorRealizationItem[] }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${programId}/indicators/${id}/realizations`);
  return data;
};
