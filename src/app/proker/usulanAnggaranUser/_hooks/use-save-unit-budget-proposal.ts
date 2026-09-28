import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveUnitBudgetProposal } from "@/api/proker/usulanAnggaran/api";
import { TSaveUnitBudgetProposalPayload } from "@/api/proker/usulanAnggaran/type";
import { queryKeys } from "@/commons/constants/query-key";

export const useSaveUnitBudgetProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      unitId,
      year,
      payload,
    }: {
      unitId: string;
      year: number | string;
      payload: TSaveUnitBudgetProposalPayload;
    }) => saveUnitBudgetProposal(unitId, year, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.usulanAnggaran] });
    },
  });
};
