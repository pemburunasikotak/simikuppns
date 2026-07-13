import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDefaultProgram } from "@/api/proker/manajemenProgram/api";
import { TDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";

export const useCreateDefaultProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TDefaultProgramPayload) => createDefaultProgram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "list"] });
    },
  });
};

export default useCreateDefaultProgram;
