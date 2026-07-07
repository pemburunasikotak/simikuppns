import { useQuery } from "@tanstack/react-query";
import { getIntegrationPrograms } from "@/api/proker/integrasi/api";

export const useGetIntegrationPrograms = () => {
  return useQuery({
    queryKey: ["proker-integration-programs"],
    queryFn: async () => {
      return await getIntegrationPrograms();
    },
  });
};
