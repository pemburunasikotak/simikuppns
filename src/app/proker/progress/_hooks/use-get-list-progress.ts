import { getListProgress } from "@/api/proker/progress/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetProgresss = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.progress, params],
    queryFn: () => getListProgress(params),
  });
};
