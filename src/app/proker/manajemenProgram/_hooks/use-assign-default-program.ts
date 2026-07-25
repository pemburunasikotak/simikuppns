import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignDefaultProgramToUnit } from "@/api/proker/manajemenProgram/api";
import { TAssignDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";
import { enqueueSnackbar } from "notistack";

export const useAssignDefaultProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TAssignDefaultProgramPayload) => assignDefaultProgramToUnit(payload),
    onSuccess: () => {
      enqueueSnackbar("Program berhasil ditugaskan ke unit", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["proker", "default-program"] });
    },
    onError: (error: unknown) => {
      enqueueSnackbar("Gagal menugaskan program", { variant: "error" });
      console.error("Assign program error:", error);
    },
  });
};

export default useAssignDefaultProgram;
