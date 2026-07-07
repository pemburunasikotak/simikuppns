import { getListOutput } from "@/api/proker/output/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetOutputs = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.output, params],
    queryFn: () => getListOutput(params),
  });
};
