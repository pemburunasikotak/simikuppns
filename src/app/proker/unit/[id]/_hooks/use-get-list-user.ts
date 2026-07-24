import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";
import { env } from "@/libs/env";

export const getListUser = async (params?: Record<string, unknown>): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.get("/api/users", {
    params,
    baseURL: env.VITE_AUTH_API_BASE_URL,
  });
  return data;
};

export default function useGetListUser(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["proker-user-list", params],
    queryFn: () => getListUser(params || {}),
  });
}
