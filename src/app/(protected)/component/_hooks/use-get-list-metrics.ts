import { getListMetrics } from "@/api/master/metrics";
import { TGetMetricsParams } from "@/api/master/metrics/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListMetrics = (params?: TGetMetricsParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.componentRealization.list, "metrics", params],
    queryFn: () => getListMetrics(params),
  });
};

export default useGetListMetrics;
