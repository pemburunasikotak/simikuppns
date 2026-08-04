import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";

const useCreateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, payload }: { programId: string; payload: TDefaultProgramIndicatorPayload }) =>
      createProgramIndicator(programId, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker-program-indicator-list", programId] });
    },
  });
};

export default useCreateProgramIndicator;
