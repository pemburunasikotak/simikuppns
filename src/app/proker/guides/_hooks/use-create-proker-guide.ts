import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProkerGuide } from "@/api/proker/guides/api";
import { TCreateProkerGuidePayload } from "@/api/proker/guides/type";
import { queryKeys } from "@/commons/constants/query-key";

const useCreateProkerGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateProkerGuidePayload) => createProkerGuide(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.guides] });
    },
  });
};

export default useCreateProkerGuide;
