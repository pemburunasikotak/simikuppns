import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TGetProkerGuidesParams,
  TGetProkerGuidesResponse,
  TProkerGuideDetailResponse,
  TCreateProkerGuidePayload,
  TUpdateProkerGuidePayload,
} from "./type";

export const getProkerGuides = async (params?: TGetProkerGuidesParams): Promise<TGetProkerGuidesResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/guides", { params });
  return data;
};

export const getProkerGuideDetail = async (id: string): Promise<TProkerGuideDetailResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/guides/${id}`);
  return data;
};

export const createProkerGuide = async (payload: TCreateProkerGuidePayload): Promise<TProkerGuideDetailResponse> => {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.videoUrl) {
    formData.append("videoUrl", payload.videoUrl);
  }
  if (payload.file) {
    formData.append("file", payload.file);
  }

  const { data } = await prokerAxiosInstance.post("/api/v1/guides", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateProkerGuide = async (payload: TUpdateProkerGuidePayload): Promise<TProkerGuideDetailResponse> => {
  const { id, ...rest } = payload;
  const formData = new FormData();
  if (rest.title !== undefined) {
    formData.append("title", rest.title);
  }
  if (rest.description !== undefined) {
    formData.append("description", rest.description || "");
  }
  if (rest.videoUrl !== undefined) {
    formData.append("videoUrl", rest.videoUrl || "");
  }
  if (rest.file) {
    formData.append("file", rest.file);
  }

  const { data } = await prokerAxiosInstance.put(`/api/v1/guides/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteProkerGuide = async (id: string): Promise<{ isSuccess?: boolean; message?: string }> => {
  const { data } = await prokerAxiosInstance.delete(`/api/v1/guides/${id}`);
  return data;
};
