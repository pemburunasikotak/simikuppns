import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useDeleteProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id }: { programId: string; id: string }) =>
      deleteProgramIndicator(programId, id),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker-program-indicator-list", programId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useDeleteProgramIndicator;
