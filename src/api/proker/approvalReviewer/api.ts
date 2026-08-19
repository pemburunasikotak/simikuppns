import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TApprovalReviewerPayload,
  TApprovalReviewerResponse,
  TApprovalReviewerDetailResponse,
  TApprovalReviewerItem,
} from "./type";

export const getApprovalReviewers = async (
  params?: Record<string, unknown>
): Promise<TApprovalReviewerResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/approval-reviewers", {
    params,
  });
  return data;
};

export const getApprovalReviewerById = async (
  id: string
): Promise<TApprovalReviewerDetailResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/approval-reviewers/${id}`);
  return data;
};

export const createApprovalReviewer = async (
  payload: TApprovalReviewerPayload
): Promise<{ isSuccess: boolean; message?: string; data?: TApprovalReviewerItem | TApprovalReviewerItem[] }> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/approval-reviewers", payload);
  return data;
};

export const updateApprovalReviewer = async (
  id: string,
  payload: Partial<TApprovalReviewerPayload>
): Promise<{ isSuccess: boolean; message?: string; data?: TApprovalReviewerItem }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/approval-reviewers/${id}`, payload);
  return data;
};

export const deleteApprovalReviewer = async (
  id: string
): Promise<{ isSuccess?: boolean; message?: string }> => {
  const { data } = await prokerAxiosInstance.delete(`/api/v1/approval-reviewers/${id}`);
  return data;
};
