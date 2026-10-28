import { useQuery } from "@tanstack/react-query";
import { getUnitBudgetProposals, getMyUnitBudgetProposals } from "@/api/proker/usulanAnggaran/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useGetUnitBudgetProposals = (
  params?: Record<string, unknown>,
  options?: { isMyUnitsOnly?: boolean; year?: number | string; unitId?: string }
) => {
  const isMyUnitsOnly = options?.isMyUnitsOnly;
  const mergedParams = {
    ...params,
    ...(options?.year !== undefined ? { year: options.year } : {}),
    ...(options?.unitId !== undefined ? { unitId: options.unitId, UnitId: options.unitId } : {}),
  };

  return useQuery({
    queryKey: [queryKeys.proker.usulanAnggaran, mergedParams, isMyUnitsOnly],
    queryFn: () => (isMyUnitsOnly ? getMyUnitBudgetProposals(mergedParams) : getUnitBudgetProposals(mergedParams)),
  });
};
