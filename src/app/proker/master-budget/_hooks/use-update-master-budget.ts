import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMasterBudgetTotal,
  updateMasterBudgetRealization,
} from "@/api/proker/masterBudget/api";

export type TUpdateMasterBudgetParams = {
  year: number | string;
  budget?: number;
  realization?: number;
};

export const useUpdateMasterBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ year, budget, realization }: TUpdateMasterBudgetParams) => {
      let result;
      if (budget !== undefined) {
        result = await updateMasterBudgetTotal(year, { budget });
      }
      if (realization !== undefined) {
        result = await updateMasterBudgetRealization(year, { realization });
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-budgets"] });
    },
  });
};
