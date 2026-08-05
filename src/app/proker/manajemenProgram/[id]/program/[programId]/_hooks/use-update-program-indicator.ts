import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgramIndicator } from "@/api/proker/manajemenProgram/api";


const useUpdateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id, payload }: { programId: string; id: string; payload: FormData }) =>
      updateProgramIndicator(programId, id, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", programId] });
    },
  });
};

export default useUpdateProgramIndicator;
