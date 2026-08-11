import { api } from "@/libs/axios/api";
import {
  TGetVerificationDashboardParams,
  TVerificationDashboardResponse,
  TVerifyRealizationRequest,
  TVerifyRealizationResponse,
} from "./type";

export const getVerificationDashboard = async (
  params?: TGetVerificationDashboardParams
): Promise<TVerificationDashboardResponse> => {
  const res = await api.get<TVerificationDashboardResponse>(
    "/api/verifications/dashboard",
    { params }
  );
  return res.data;
};

export const verifyRealization = async (
  req: TVerifyRealizationRequest
): Promise<TVerifyRealizationResponse> => {
  const res = await api.post<TVerifyRealizationResponse>("/api/verifications", req);
  return res.data;
};
