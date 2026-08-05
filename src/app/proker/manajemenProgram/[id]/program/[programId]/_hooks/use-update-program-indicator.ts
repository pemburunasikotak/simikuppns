import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";

const useUpdateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id, payload }: { programId: string; id: string; payload: TDefaultProgramIndicatorPayload }) =>
      updateProgramIndicator(programId, id, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", programId] });
    },
  });
};

export default useUpdateProgramIndicator;
