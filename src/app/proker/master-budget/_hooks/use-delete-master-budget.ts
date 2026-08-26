import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMasterBudget } from "@/api/proker/masterBudget/api";

export const useDeleteMasterBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (year: number | string) => deleteMasterBudget(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-budgets"] });
    },
  });
};
