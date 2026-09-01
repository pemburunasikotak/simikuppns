import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviseIndicator } from "@/api/proker/revision/api";
import { TReviseIndicatorPayload } from "@/api/proker/revision/type";

export const useReviseIndicator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TReviseIndicatorPayload;
    }) => reviseIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-revision-indicators"] });
    },
  });
};
