import { getDetailPeriod } from "@/api/period";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailPeriod = (params: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.period.detail, params],
    queryFn: () => getDetailPeriod(params),
    enabled: !!params.id,
  });
};

export default useGetDetailPeriod;
