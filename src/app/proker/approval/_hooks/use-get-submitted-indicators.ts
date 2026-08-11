import { useQuery } from "@tanstack/react-query";
import { getSubmittedIndicators } from "@/api/proker/approval/api";

export const useGetSubmittedIndicators = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-submitted-indicators", params],
    queryFn: async () => {
      return await getSubmittedIndicators(params);
    },
  });
};
