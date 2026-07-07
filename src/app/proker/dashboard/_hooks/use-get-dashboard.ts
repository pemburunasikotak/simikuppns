import { useQuery } from "@tanstack/react-query";
import { getProkerDashboard } from "@/api/proker/dashboard/api";
import { TProkerDashboardResponse } from "@/api/proker/dashboard/type";

export const useGetProkerDashboard = () => {
  return useQuery<TProkerDashboardResponse>({
    queryKey: ["proker-dashboard"],
    queryFn: async () => {
      const data = await getProkerDashboard();
      return data;
    },
  });
};
