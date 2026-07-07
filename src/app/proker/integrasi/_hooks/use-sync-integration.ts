import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncIntegrationPrograms } from "@/api/proker/integrasi/api";

export const useSyncIntegrationPrograms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await syncIntegrationPrograms();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-integration-programs"] });
    },
  });
};
