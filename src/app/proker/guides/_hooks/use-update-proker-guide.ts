import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProkerGuide } from "@/api/proker/guides/api";
import { TUpdateProkerGuidePayload } from "@/api/proker/guides/type";
import { queryKeys } from "@/commons/constants/query-key";

const useUpdateProkerGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TUpdateProkerGuidePayload) => updateProkerGuide(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.guides] });
    },
  });
};

export default useUpdateProkerGuide;
