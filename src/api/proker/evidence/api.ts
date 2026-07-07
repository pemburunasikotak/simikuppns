import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerEvidence, TProkerEvidencePayload, TProkerEvidenceResponse } from "./type";

export const getListEvidence = async (params?: Record<string, unknown>): Promise<TProkerEvidenceResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/evidences", { params });
  return data;
};

export const getEvidenceById = async (id: string): Promise<{ isSuccess: boolean; data: TProkerEvidence }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/evidences/${id}`);
  return data;
};

export const createEvidence = async (payload: TProkerEvidencePayload): Promise<{ isSuccess: boolean; data: TProkerEvidence }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/evidences", payload);
  return data;
};

export const updateEvidence = async (id: string, payload: TProkerEvidencePayload): Promise<{ isSuccess: boolean; data: TProkerEvidence }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/evidences/${id}`, payload);
  return data;
};

export const deleteEvidence = async (id: string): Promise<unknown> => {
  await prokerAxiosInstance.delete(`/api/v1/evidences/${id}`);
  return;
};
