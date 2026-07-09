import { useMutation } from "@tanstack/react-query";
import { createAktivitas } from "@/api/proker/aktivitas/api";
import { TProkerAktivitasPayload } from "@/api/proker/aktivitas/type";

export const useCreateProgramActivity = (programId: string) => {

  return useMutation({
    mutationFn: (payload: TProkerAktivitasPayload) => createAktivitas(programId, payload),
    onSuccess: () => {
      // Invalidate queries if necessary, maybe the activity list
      // queryClient.invalidateQueries({ queryKey: ["proker/aktivitas"] });
    },
  });
};
