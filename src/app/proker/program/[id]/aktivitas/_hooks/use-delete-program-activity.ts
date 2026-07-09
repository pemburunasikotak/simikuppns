import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAktivitas } from "@/api/proker/aktivitas/api";
import { queryKeys } from "@/commons/constants/query-key";

export const useDeleteProgramActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAktivitas(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.aktivitas] });
    },
  });
};
