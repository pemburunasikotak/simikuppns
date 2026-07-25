import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignDefaultProgramIndicator } from "@/api/proker/manajemenProgram/api";
import { TAssignDefaultProgramIndicatorPayload } from "@/api/proker/manajemenProgram/type";

const useAssignProgramIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TAssignDefaultProgramIndicatorPayload) => assignDefaultProgramIndicator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["default-program"] });
    },
  });
};

export default useAssignProgramIndicator;
