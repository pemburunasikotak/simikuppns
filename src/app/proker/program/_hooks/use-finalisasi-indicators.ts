import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalisasiIndicators } from "@/api/proker/program/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useFinalisasiIndicators = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (year?: string | number) => finalisasiIndicators(year ?? 2025),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useFinalisasiIndicators;
