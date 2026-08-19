import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDefaultProgramIndicator } from "@/api/proker/manajemenProgram/api";

const useDeleteProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id }: { programId: string; id: string }) => deleteDefaultProgramIndicator(programId, id),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", programId] });
    },
  });
};

export default useDeleteProgramIndicator;
