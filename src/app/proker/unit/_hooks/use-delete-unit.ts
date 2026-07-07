import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProkerUnit } from "@/api/proker/unit/api";

export const useDeleteProkerUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteProkerUnit(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-units"] });
    },
  });
};
