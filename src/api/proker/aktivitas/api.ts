import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerAktivitas, TProkerAktivitasPayload, TProkerAktivitasResponse } from "./type";

export const getListAktivitas = async (programId: string, params?: Record<string, unknown>): Promise<TProkerAktivitasResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${programId}/activities`, { params });
  return data;
};

export const getAktivitasById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/activities/${id}`);
  return data;
};

export const createAktivitas = async (programId: string, payload: TProkerAktivitasPayload): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${programId}/activities`, payload);
  return data;
};

export const updateAktivitas = async (id: string, payload: TProkerAktivitasPayload): Promise<{ isSuccess: boolean; data: TProkerAktivitas }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/activities/${id}`, payload);
  return data;
};

export const deleteAktivitas = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/activities/${id}`);
  return;
};
