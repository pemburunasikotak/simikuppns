import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProgram } from "@/api/proker/program/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string }) => deleteProgram(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.program] });
    },
  });
};

export default useDeleteProgram;
