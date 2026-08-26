import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerUnit, TProkerUnitPayload, TProkerUnitResponse, TUnitProgramItem } from "./type";

export const getProkerUnits = async (params?: Record<string, unknown>): Promise<TProkerUnitResponse['data']> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/units", { params });
  return data?.data || { items: [], pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 } };
};


export const getProkerUnitById = async (id: string): Promise<TProkerUnit> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${id}`);
  return data?.data || data;
};

export const createProkerUnit = async (payload: TProkerUnitPayload): Promise<TProkerUnit> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/units", payload);
  return data?.data || data;
};

export const updateProkerUnit = async ({ id, payload }: { id: string; payload: TProkerUnitPayload }): Promise<TProkerUnit> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/units/${id}`, payload);
  return data?.data || data;
};

export const deleteProkerUnit = async (id: string): Promise<void> => {
  await prokerAxiosInstance.delete(`/api/v1/units/${id}`);
};

export type TMyUnitItem = {
  id?: string;
  name?: string;
  unit?: {
    id?: string;
    name?: string;
  };
};

export const getMyUnits = async (params?: Record<string, unknown>): Promise<TMyUnitItem[]> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/units/my-units", { params });
  return data?.data || data;
};

export const getUnitUsers = async (unitId: string, params?: Record<string, unknown>): Promise<{ data: { items: { id: string; name: string;[key: string]: unknown }[] } }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${unitId}/users`, { params });
  return data;
};

export const getUnitPrograms = async (unitId: string, params?: Record<string, unknown>): Promise<TUnitProgramItem[]> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${unitId}/programs`, { params });
  return data?.data || data;
};

export const exportProkerByUnit = async (unitId: string | number, year: string | number): Promise<Blob> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/programs/export/proker", {
    params: { unitId, year },
    responseType: "blob",
  });
  return data;
};


