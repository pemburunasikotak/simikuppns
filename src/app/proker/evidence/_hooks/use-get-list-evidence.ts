import { getListEvidence } from "@/api/proker/evidence/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetEvidences = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.evidence, params],
    queryFn: () => getListEvidence(params),
  });
};
