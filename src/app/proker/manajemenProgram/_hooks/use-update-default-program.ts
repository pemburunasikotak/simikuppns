import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDefaultProgram } from "@/api/proker/manajemenProgram/api";
import { TDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";

export const useUpdateDefaultProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TDefaultProgramPayload }) =>
      updateDefaultProgram(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "list"] });
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", variables.id] });
    },
  });
};

export default useUpdateDefaultProgram;
