import { useQuery } from "@tanstack/react-query";
import { getMasterBudgets } from "@/api/proker/masterBudget/api";

export const useGetMasterBudgets = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-master-budgets", params],
    queryFn: () => getMasterBudgets(params),
  });
};
