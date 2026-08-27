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

export type TProkerDocumentType = "EVIDENCE" | "RAB" | "PROPOSAL" | "OTHER";

export const uploadProkerDocument = async (
  file: File,
  type: TProkerDocumentType = "EVIDENCE"
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  let responseData: Record<string, unknown> | undefined;
  try {
    const { data } = await prokerAxiosInstance.post<Record<string, unknown>>("/api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    responseData = data;
  } catch {
    const { data } = await prokerAxiosInstance.post<Record<string, unknown>>("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    responseData = data;
  }

  let target = responseData?.data || responseData?.result || responseData;
  if (Array.isArray(target) && target.length > 0) {
    target = target[0];
  }

  if (typeof target === "string") return target;
  if (typeof target === "object" && target !== null) {
    const obj = target as Record<string, unknown>;
    if (obj.id) return String(obj.id);
    if (obj._id) return String(obj._id);
    if (obj.url) return String(obj.url);
    if (obj.path) return String(obj.path);
  }
  return "";
};

export const uploadProkerDocuments = async (
  files: File[],
  type: TProkerDocumentType = "EVIDENCE"
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadProkerDocument(file, type));
  const results = await Promise.all(uploadPromises);
  return results.filter(Boolean);
};

export const addIndicatorRealization = async (programId: string, id: string, payload: import('./type').TAddIndicatorRealizationPayload): Promise<{ isSuccess: boolean; data: unknown }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/programs/${programId}/indicators/${id}/realizations`, payload);
  return data;
};

export const getIndicatorRealizations = async (programId: string, id: string): Promise<{ isSuccess: boolean; data: import('./type').TIndicatorRealizationItem[] }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${programId}/indicators/${id}/realizations`);
  return data;
};

export const getIndicatorUsers = async (programId: string, id: string, params?: Record<string, unknown>): Promise<{ data: { items: { id: string; name: string;[key: string]: unknown }[] } }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/programs/${programId}/indicators/${id}/users`, { params });
  return data;
};

export const exportProkerExcel = async (year: string | number, type: string): Promise<Blob> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/programs/export/proker", {
    params: { year, type },
    responseType: "blob",
  });
  return data;
};

export const finalisasiIndicators = async (year: string | number = 2025): Promise<{ isSuccess: boolean; message?: string; data?: unknown }> => {
  const { data } = await prokerAxiosInstance.patch(`/api/v1/indicators/change-to-in-progress/${year}`);
  return data;
};
