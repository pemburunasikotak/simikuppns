import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDefaultProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TCreateDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";

const useCreateDefaultProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TCreateDefaultProgramIndicatorPayload }) =>
      createDefaultProgramIndicator(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", id] });
    },
  });
};

export default useCreateDefaultProgramIndicator;
