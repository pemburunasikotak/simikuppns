import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setProgramIndicatorTarget } from "@/api/proker/program/api";
import { TSetProgramIndicatorTargetPayload } from "@/api/proker/program/type";
import { queryKeys } from "@/commons/constants/query-key";

const useSetProgramIndicatorTarget = (programId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TSetProgramIndicatorTargetPayload }) =>
      setProgramIndicatorTarget(programId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-program-indicator-list", programId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useSetProgramIndicatorTarget;
