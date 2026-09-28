import { useQuery } from "@tanstack/react-query";
import { getUnitBudgetProposals, getMyUnitBudgetProposals } from "@/api/proker/usulanAnggaran/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetUnitBudgetProposals = (
  params?: Record<string, unknown>,
  options?: { isMyUnitsOnly?: boolean }
) => {
  const isMyUnitsOnly = options?.isMyUnitsOnly;
  return useQuery({
    queryKey: [queryKeys.proker.usulanAnggaran, params, isMyUnitsOnly],
    queryFn: () => (isMyUnitsOnly ? getMyUnitBudgetProposals(params) : getUnitBudgetProposals(params)),
  });
};
