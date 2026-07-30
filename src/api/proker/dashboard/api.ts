import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerDashboardResponse } from "./type";

export const getProkerDashboard = async (): Promise<TProkerDashboardResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/dashboard");
  // Some APIs wrap response in data.data or data.result, we'll return data directly as per user spec
  // If the API wraps it, adjust accordingly: return data?.data || data;
  return data.data;
};
