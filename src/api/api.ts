import { api } from "@/libs/axios/api";

import { TUploadFileRequest, TUploadFileResponse } from './type';

export const uploadFile = async (req: TUploadFileRequest): Promise<TUploadFileResponse> => {
  const res = await api.post<TUploadFileResponse>(`/api/upload/images?folder=${req.folder}`, req.files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const uploadVideos = async (req: TUploadFileRequest): Promise<TUploadFileResponse> => {
  const res = await api.post<TUploadFileResponse>(`/api/upload/videos/${req.folder}`, req.files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
