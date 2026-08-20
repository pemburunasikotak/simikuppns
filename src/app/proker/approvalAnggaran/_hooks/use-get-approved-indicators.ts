import { useQuery } from "@tanstack/react-query";
import { getApprovedIndicators } from "@/api/proker/approval/api";

export const useGetApprovedIndicators = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-approved-indicators", params],
    queryFn: async () => {
      return await getApprovedIndicators(params);
    },
  });
};
