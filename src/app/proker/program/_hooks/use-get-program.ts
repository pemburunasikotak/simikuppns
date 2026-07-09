import { getProgramById } from "@/api/proker/program/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetProgram = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.proker.program, id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
};

export default useGetProgram;
