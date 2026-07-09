import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgram } from "@/api/proker/program/api";
import { TProkerProgramPayload } from "@/api/proker/program/type";

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TProkerProgramPayload) => createProgram(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export default useCreateProgram;
