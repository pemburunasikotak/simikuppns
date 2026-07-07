import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProkerUnit } from "@/api/proker/unit/api";
import { TProkerUnitPayload } from "@/api/proker/unit/type";

export const useCreateProkerUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TProkerUnitPayload) => {
      return await createProkerUnit(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-units"] });
    },
  });
};
