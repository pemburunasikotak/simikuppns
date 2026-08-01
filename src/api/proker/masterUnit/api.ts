import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerMasterUnitPayload, TProkerMasterUnitResponse, TProkerMasterUnit } from "./type";

export const getProkerMasterUnits = async (params?: Record<string, unknown>): Promise<TProkerMasterUnitResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/master-unit-types", { params });
  return data;
};

export const createProkerMasterUnit = async (payload: TProkerMasterUnitPayload): Promise<TProkerMasterUnit> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/master-unit-types", payload);
  return data;
};

export const getProkerMasterUnitById = async (id: string): Promise<{ data: TProkerMasterUnit }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/master-unit-types/${id}`);
  return data;
};

export const updateProkerMasterUnit = async (id: string, payload: TProkerMasterUnitPayload): Promise<TProkerMasterUnit> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/master-unit-types/${id}`, payload);
  return data;
};

export const deleteProkerMasterUnit = async (id: string): Promise<void> => {
  await prokerAxiosInstance.delete(`/api/v1/master-unit-types/${id}`);
};

export const exportProkerMasterUnits = async (): Promise<Blob> => {
  const response = await prokerAxiosInstance.get("/api/v1/master-unit-types/export", {
    responseType: "blob",
    headers: {
      Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  return response.data;
};

export const importProkerMasterUnits = async (file: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await prokerAxiosInstance.post("/api/v1/master-unit-types/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "*/*",
    },
  });
  return data;
};
