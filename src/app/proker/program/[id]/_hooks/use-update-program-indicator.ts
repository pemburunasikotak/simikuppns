import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";
import { queryKeys } from "@/commons/constants/query-key";

const useUpdateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id, payload }: { programId: string; id: string; payload: TDefaultProgramIndicatorPayload }) =>
      updateProgramIndicator(programId, id, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker-program-indicator-list", programId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useUpdateProgramIndicator;
