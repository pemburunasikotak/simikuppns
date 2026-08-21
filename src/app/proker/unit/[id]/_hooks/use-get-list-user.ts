import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";
import { env } from "@/libs/env";
import { TAuthUserItem } from "@/api/user/type";

export type TGetListUserResponse = {
  success?: boolean;
  data?: TAuthUserItem[] | {
    items: TAuthUserItem[];
    pagination?: {
      page?: number;
      limit?: number;
      totalItems?: number;
      totalPages?: number;
    };
  };
  pagination?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
  };
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

export function useGetInfiniteUser(params?: Record<string, unknown>) {
  return useInfiniteQuery<TGetListUserResponse>({
    queryKey: ["proker-user-list-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getListUser({
        limit: 10,
        page: pageParam,
        ...params,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Record<string, unknown>, allPages) => {
      const rawData = lastPage?.data;
      let itemsCount = 0;

      if (Array.isArray(rawData)) {
        itemsCount = rawData.length;
      } else if (rawData && typeof rawData === "object" && "items" in rawData && Array.isArray((rawData as { items: unknown[] }).items)) {
        itemsCount = (rawData as { items: unknown[] }).items.length;
      }

      const pagination = (lastPage?.pagination ||
        (rawData && typeof rawData === "object" && "pagination" in rawData ? (rawData as { pagination: unknown }).pagination : undefined)) as
        | { totalPages?: number; totalPage?: number; total?: number; totalItems?: number; limit?: number }
        | undefined;

      const limit = Number(pagination?.limit) || 10;
      const totalPages =
        Number(pagination?.totalPages || pagination?.totalPage) ||
        (pagination?.total ? Math.ceil(Number(pagination.total) / limit) : 0) ||
        (pagination?.totalItems ? Math.ceil(Number(pagination.totalItems) / limit) : 0);

      const currentPage = allPages.length;

      if (itemsCount === 0) return undefined;
      if (totalPages > 0 && currentPage >= totalPages) return undefined;
      if (itemsCount < limit) return undefined;

      return currentPage + 1;
    },
  });
}


