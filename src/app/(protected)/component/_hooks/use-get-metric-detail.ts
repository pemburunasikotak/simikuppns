import { getMetricDetail } from "@/api/master/metrics";
import { TMetricDetailResponse } from "@/api/master/metrics/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetMetricDetail = (type: string, id: string) => {
  return useQuery<TMetricDetailResponse>({
    queryKey: [queryKeys.masterData.componentRealization.detail, type, id],
    queryFn: () => getMetricDetail(type, id),
    enabled: !!type && !!id,
  });
};

export default useGetMetricDetail;
