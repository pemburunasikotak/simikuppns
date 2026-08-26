import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMasterBudget } from "@/api/proker/masterBudget/api";
import { TCreateMasterBudgetPayload } from "@/api/proker/masterBudget/type";

export const useCreateMasterBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateMasterBudgetPayload) => createMasterBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-budgets"] });
    },
  });
};
