import { useQuery } from "@tanstack/react-query";
import { getProkerUnits } from "@/api/proker/unit/api";

export const useGetProkerUnits = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker-units", params],
    queryFn: async () => {
      return await getProkerUnits(params);
    },
  });
};
