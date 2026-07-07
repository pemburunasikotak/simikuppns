import { getListProgram } from "@/api/proker/program/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetPrograms = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.program, params],
    queryFn: () => getListProgram(params),
  });
};
