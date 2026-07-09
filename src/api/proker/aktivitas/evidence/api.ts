import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerEvidence, TProkerEvidenceResponse } from "./type";

export const getListEvidences = async (activityId: string, params?: Record<string, unknown>): Promise<TProkerEvidenceResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/activities/${activityId}/evidences`, { params });
  return data;
};

export const createEvidence = async (activityId: string, payload: FormData): Promise<{ isSuccess: boolean; data: TProkerEvidence }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/activities/${activityId}/evidences`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteEvidence = async (activityId: string, id: string): Promise<unknown> => {

  console.log('ID', activityId)
  await prokerAxiosInstance.delete(`/api/v1/evidences/${id}`);
  return;
};
