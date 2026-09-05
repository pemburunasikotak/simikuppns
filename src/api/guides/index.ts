import { api } from "@/libs/axios/api";
import { TResponse } from "@/commons/types/response";
import {
  TGetGuidesParams,
  TGetGuidesResponse,
  TGuideDetailResponse,
  TCreateGuidePayload,
  TUpdateGuidePayload,
} from "./type";

export const getGuides = async (params: TGetGuidesParams): Promise<TGetGuidesResponse> => {
  const { data } = await api({
    url: "/api/guides",
    method: "GET",
    params,
  });
  return data;
};

export const getGuideDetail = async (id: string): Promise<TGuideDetailResponse> => {
  const { data } = await api({
    url: `/api/guides/${id}`,
    method: "GET",
  });
  return data;
};

export const createGuide = async (payload: TCreateGuidePayload): Promise<TGuideDetailResponse> => {
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

  const { data } = await api({
    url: "/api/guides",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateGuide = async (payload: TUpdateGuidePayload): Promise<TGuideDetailResponse> => {
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

  const { data } = await api({
    url: `/api/guides/${id}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteGuide = async (id: string): Promise<TResponse<null>> => {
  const { data } = await api({
    url: `/api/guides/${id}`,
    method: "DELETE",
  });
  return data;
};
