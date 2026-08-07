import { api } from "@/libs/axios/api";
import { TDefaultResponse } from "@/commons/types/response";
import {
  TGetPeriodLockParams,
  TPeriodLockListResponse,
  TPeriodLockUpdateRequest,
  TPeriodLockBulkUpdateRequest,
} from "./type";

export const getPeriodLocks = async (
  params: TGetPeriodLockParams,
): Promise<TPeriodLockListResponse> => {
  const res = await api.get("/api/settings/period-locks", { params });
  const responseData = res.data;
  if (responseData.data && !responseData.result) {
    responseData.result = responseData.data;
  }
  return responseData;
};

export const updatePeriodLock = async (
  req: TPeriodLockUpdateRequest,
): Promise<TDefaultResponse> => {
  try {
    const res = await api.post("/api/settings/period-locks", req);
    return res.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    // Fallback to PUT if POST returns 405 or 404
    if (err.response && (err.response.status === 405 || err.response.status === 404)) {
      const res = await api.put("/api/settings/period-locks", req);
      return res.data;
    }
    throw error;
  }
};

export const updateBulkPeriodLocks = async (
  req: TPeriodLockBulkUpdateRequest,
): Promise<TDefaultResponse> => {
  const res = await api.post("/api/settings/period-locks/bulk", req);
  return res.data;
};
