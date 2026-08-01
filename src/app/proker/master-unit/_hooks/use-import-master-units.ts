import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importProkerMasterUnits } from "@/api/proker/masterUnit/api";

export const useImportProkerMasterUnits = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => importProkerMasterUnits(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-units"] });
    },
  });
};
