import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProkerMasterUnit } from "@/api/proker/masterUnit/api";

export const useDeleteProkerMasterUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteProkerMasterUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-units"] });
    },
  });
};
