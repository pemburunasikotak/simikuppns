import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addIndicatorRealization } from "@/api/proker/program/api";
import { TAddIndicatorRealizationPayload } from "@/api/proker/program/type";

const useAddIndicatorRealization = (programId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TAddIndicatorRealizationPayload }) =>
      addIndicatorRealization(programId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-program-indicator", programId] });
      queryClient.invalidateQueries({ queryKey: ["indicator-realizations", programId] });
    },
  });
};

export default useAddIndicatorRealization;
