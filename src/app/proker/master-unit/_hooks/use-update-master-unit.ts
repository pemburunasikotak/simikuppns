import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProkerMasterUnit } from "@/api/proker/masterUnit/api";
import { TProkerMasterUnitPayload } from "@/api/proker/masterUnit/type";

export const useUpdateProkerMasterUnit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TProkerMasterUnitPayload }) => updateProkerMasterUnit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-master-units"] });
    },
  });
};
