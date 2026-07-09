import { getListAktivitas } from "@/api/proker/aktivitas/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetAktivitass = (programId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.aktivitas, programId, params],
    queryFn: () => getListAktivitas(programId, params),
  });
};
