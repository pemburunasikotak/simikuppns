import { useQuery } from "@tanstack/react-query";
import { getListProgramIndicator } from "@/api/proker/manajemenProgram/api";

const useGetListProgramIndicator = (programId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-program-indicator-list", programId, params],
    queryFn: () => getListProgramIndicator(programId, params),
    enabled: !!programId,
  });
};

export default useGetListProgramIndicator;
