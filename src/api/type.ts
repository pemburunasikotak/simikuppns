import { TResponse } from "@/commons/types/response";

export type TUploadFileRequest = {
  folder: string;
  files: FormData;
};

export type TUploadFile = {
  path: string;
  url: string;
};

export type TUploadFileResponse = TResponse<TUploadFile[]>;
