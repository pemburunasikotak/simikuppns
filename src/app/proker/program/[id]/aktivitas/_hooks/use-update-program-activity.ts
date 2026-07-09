import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAktivitas } from "@/api/proker/aktivitas/api";
import { TProkerAktivitasPayload } from "@/api/proker/aktivitas/type";
import { queryKeys } from "@/commons/constants/query-key";

export const useUpdateProgramActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TProkerAktivitasPayload }) => updateAktivitas(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.aktivitas] });
    },
  });
};
