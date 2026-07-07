import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TIntegrationProgram } from "./type";

export const getIntegrationPrograms = async (): Promise<TIntegrationProgram[]> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/integration/programs");
  return data?.data || data || [];
};

export const syncIntegrationPrograms = async (): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post("/api/v1/integration/programs/sync");
  return data;
};
