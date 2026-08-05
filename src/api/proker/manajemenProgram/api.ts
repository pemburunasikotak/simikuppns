import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TDefaultProgram,
  TDefaultProgramPayload,
  TDefaultProgramResponse,
  TProkerIkuListResponse,
  TAssignDefaultProgramPayload,
  TDefaultProgramIndicatorPayload,
  TDefaultProgramIndicatorResponse,
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

export const getIkuUnits = async (ikuId: string): Promise<{ data: import("./type").TIkuUnit[] }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/ikus/${ikuId}/units`);
  return data;
};

export const getDefaultProgramsByIku = async (ikuId: string): Promise<TDefaultProgram[]> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/default-programs/by-iku/${ikuId}`);
  // If the API returns `{ isSuccess: true, data: [...] }`
  if (data && data.data && Array.isArray(data.data)) {
    return data.data;
  }
  return data; // If it directly returns an array
};

export const assignDefaultProgramToUnit = async (payload: TAssignDefaultProgramPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/default-programs/assign-to-unit", payload);
  return data;
};

export const assignIndicatorToUnit = async (payload: import("./type").TAssignIndicatorToUnitPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/default-programs/indicators/assign", payload);
  return data;
};

export const getAssignmentStructure = async (params?: Record<string, unknown>): Promise<import("./type").TAssignmentStructureResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/default-programs/assignment-structure", { params });
  return data;
};
export const getListProgramIndicator = async (programId: string, params?: Record<string, unknown>): Promise<TDefaultProgramIndicatorResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${programId}/indicators`, { params });
  return data;
};

export const createProgramIndicator = async (programId: string, payload: TDefaultProgramIndicatorPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${programId}/indicators`, payload);
  return data;
};

export const createDefaultProgramIndicator = async (id: string, payload: import("./type").TCreateDefaultProgramIndicatorPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/default-programs/${id}/indicators`, payload);
  return data;
};

export const updateProgramIndicator = async (programId: string, id: string, payload: TDefaultProgramIndicatorPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/programs/${programId}/indicators/${id}`, payload);
  return data;
};

export const deleteProgramIndicator = async (programId: string, id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/programs/${programId}/indicators/${id}`);
  return;
};

export const assignDefaultProgramIndicator = async (payload: import("./type").TAssignDefaultProgramIndicatorPayload): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/default-programs/indicators/assign", payload);
  return data;
};
