import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";

export const getListIKU = async (params?: Record<string, unknown>): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/ikus", { params });
  return data;
};

export default function useGetListIKU(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["proker-iku-list", params],
    queryFn: () => getListIKU(params),
  });
}
