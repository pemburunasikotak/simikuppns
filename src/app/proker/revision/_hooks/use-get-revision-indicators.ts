import { useQuery } from "@tanstack/react-query";
import { getRevisionIndicators } from "@/api/proker/revision/api";

export const useGetRevisionIndicators = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-revision-indicators", params],
    queryFn: async () => {
      return await getRevisionIndicators(params);
    },
  });
};
