import { useQuery } from "@tanstack/react-query";
import { getListProgramIndicator } from "@/api/proker/manajemenProgram/api";

const useGetListProgramIndicator = (programId: string, params?: Record<string, unknown>) => {
  // Pisahkan 'enabled' dari params agar tidak ikut dikirim ke API
  const { enabled, ...queryParams } = params || {};

  return useQuery({
    queryKey: ["proker-program-indicator-list", programId, queryParams],
    queryFn: () => getListProgramIndicator(programId, queryParams),
    enabled: !!programId && (enabled !== undefined ? Boolean(enabled) : true),
  });
};

export default useGetListProgramIndicator;
