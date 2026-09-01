import { useQuery } from "@tanstack/react-query";
import { getRejectedIndicators } from "@/api/proker/rejected/api";

export const useGetRejectedIndicators = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-rejected-indicators", params],
    queryFn: async () => {
      return await getRejectedIndicators(params);
    },
  });
};
