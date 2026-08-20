import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getListIkuProker } from "@/api/proker/manajemenProgram/api";

export const useGetListIkuProker = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker", "iku", "list", params],
    queryFn: () => getListIkuProker(params),
  });
};

export const useGetInfiniteIkuProker = (params?: Record<string, unknown>) => {
  return useInfiniteQuery({
    queryKey: ["proker", "iku", "list-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getListIkuProker({
        limit: 10,
        page: pageParam,
        per_page: 10,
        ...params,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: Record<string, unknown>, allPages) => {
      const rawData = (lastPage as Record<string, unknown>)?.data;
      let itemsCount = 0;
      if (Array.isArray(rawData)) {
        itemsCount = rawData.length;
      } else if (rawData && typeof rawData === "object" && "items" in rawData && Array.isArray((rawData as { items: unknown[] }).items)) {
        itemsCount = (rawData as { items: unknown[] }).items.length;
      }

      const pagination = ((lastPage as Record<string, unknown>)?.pagination ||
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
};

export default useGetListIkuProker;
