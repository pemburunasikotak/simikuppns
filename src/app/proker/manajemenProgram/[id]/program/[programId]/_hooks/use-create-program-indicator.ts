import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgramIndicator } from "@/api/proker/manajemenProgram/api";


const useCreateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, payload }: { programId: string; payload: FormData }) =>
      createProgramIndicator(programId, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", programId] });
    },
  });
};

export default useCreateProgramIndicator;
