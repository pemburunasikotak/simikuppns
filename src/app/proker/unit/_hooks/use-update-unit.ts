import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProkerUnit } from "@/api/proker/unit/api";
import { TProkerUnitPayload } from "@/api/proker/unit/type";

export const useUpdateProkerUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: TProkerUnitPayload }) => {
      return await updateProkerUnit({ id, payload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-units"] });
    },
  });
};
