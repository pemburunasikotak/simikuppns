import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDefaultProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TCreateDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";

const useUpdateProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, id, payload }: { programId: string; id: string; payload: TCreateDefaultProgramIndicatorPayload }) =>
      updateDefaultProgramIndicator(programId, id, payload),
    onSuccess: (_, { programId }) => {
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program", "detail", programId] });
    },
  });
};

export default useUpdateProgramIndicator;
