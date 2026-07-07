import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerUnit, TProkerUnitPayload, TProkerUnitResponse } from "./type";

export const getProkerUnits = async (): Promise<TProkerUnitResponse['data']> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/units");
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
