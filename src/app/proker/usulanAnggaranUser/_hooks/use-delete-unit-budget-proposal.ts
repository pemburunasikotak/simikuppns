import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUnitBudgetProposal } from "@/api/proker/usulanAnggaran/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useDeleteUnitBudgetProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, year }: { unitId: string; year: number | string }) =>
      deleteUnitBudgetProposal(unitId, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.usulanAnggaran] });
    },
  });
};
