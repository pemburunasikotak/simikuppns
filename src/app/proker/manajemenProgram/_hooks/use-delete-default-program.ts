import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDefaultProgram } from "@/api/proker/manajemenProgram/api";

export const useDeleteDefaultProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDefaultProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program"] });
    },
  });
};

export default useDeleteDefaultProgram;
