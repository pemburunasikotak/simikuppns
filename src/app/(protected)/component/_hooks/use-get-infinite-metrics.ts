import { getListMetrics } from "@/api/master/metrics";
import { TGetMetricsParams, TMetricsListResponse } from "@/api/master/metrics/type";
import { useInfiniteQuery } from "@/app/_hooks/request/use-infinite-query";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { InfiniteData, QueryKey } from "@tanstack/react-query";

const useGetInfiniteMetrics = (params?: TGetMetricsParams) => {
  return useInfiniteQuery<
    TMetricsListResponse,
    TErrorResponse,
    InfiniteData<TMetricsListResponse>,
    QueryKey,
    number
  >({
    queryKey: [queryKeys.masterData.componentRealization.list, "metrics", "infinite", params],
    queryFn: ({ pageParam }: { pageParam: number }) => getListMetrics({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: TMetricsListResponse) => {
      const currentPage = lastPage.result?.currentPage || 1;
      const totalPage = lastPage.result?.totalPage || 1;
      return currentPage < totalPage ? currentPage + 1 : undefined;
    },
  });
};

export default useGetInfiniteMetrics;
