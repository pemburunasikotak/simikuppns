import { getListPeriod } from "@/api/period";
import { TGetPeriodParams } from "@/api/period/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListPeriod = (params?: TGetPeriodParams) => {
  return useQuery({
    queryKey: [queryKeys.period.list, params],
    queryFn: () => getListPeriod(params),
  });
};

export default useGetListPeriod;
