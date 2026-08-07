import { getPeriodLocks } from "@/api/settings/period-lock";
import { TGetPeriodLockParams } from "@/api/settings/period-lock/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetPeriodLocks = (params: TGetPeriodLockParams) => {
  return useQuery({
    queryKey: [queryKeys.settings.periodLocks, params],
    queryFn: () => getPeriodLocks(params),
  });
};

export default useGetPeriodLocks;
