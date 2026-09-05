import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProkerGuide } from "@/api/proker/guides/api";
import { queryKeys } from "@/commons/constants/query-key";

const useDeleteProkerGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProkerGuide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.guides] });
    },
  });
};

export default useDeleteProkerGuide;
