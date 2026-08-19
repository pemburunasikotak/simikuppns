import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";
import { env } from "@/libs/env";
import { TAuthUserItem } from "@/api/user/type";

export type TGetListUserResponse = {
  success?: boolean;
  data?: TAuthUserItem[] | { items: TAuthUserItem[] };
};

export const getListUser = async (params?: Record<string, unknown>): Promise<TGetListUserResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/users", {
    params,
    baseURL: env.VITE_AUTH_API_BASE_URL,
  });
  return data;
};

export default function useGetListUser(params?: Record<string, unknown>) {
  return useQuery<TGetListUserResponse>({
    queryKey: ["proker-user-list", params],
    queryFn: () => getListUser(params || {}),
  });
}

