import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerAktivitas, TProkerAktivitasPayload, TProkerAktivitasResponse } from "./type";

export const getListAktivitas = async (params?: Record<string, unknown>): Promise<TProkerAktivitasResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/aktivitas", { params });
  return data;
};

export const getAktivitasById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/aktivitas/${id}`);
  return data;
};

export const createAktivitas = async (payload: TProkerAktivitasPayload): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/aktivitas", payload);
  return data;
};

export const updateAktivitas = async (id: string, payload: TProkerAktivitasPayload): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/aktivitas/${id}`, payload);
  return data;
};

export const deleteAktivitas = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/aktivitas/${id}`);
  return;
};
