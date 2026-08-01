import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProkerMasterUnit } from "@/api/proker/masterUnit/api";
import { TProkerMasterUnitPayload } from "@/api/proker/masterUnit/type";

export const useCreateProkerMasterUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: TProkerMasterUnitPayload) => createProkerMasterUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-units"] });
    },
  });
};
