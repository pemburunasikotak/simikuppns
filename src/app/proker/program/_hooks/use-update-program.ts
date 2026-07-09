import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgram } from "@/api/proker/program/api";
import { TProkerProgramPayload } from "@/api/proker/program/type";
import { queryKeys } from "@/commons/constants/query-key";

export const useUpdateProgram = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TProkerProgramPayload) => updateProgram(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useUpdateProgram;
