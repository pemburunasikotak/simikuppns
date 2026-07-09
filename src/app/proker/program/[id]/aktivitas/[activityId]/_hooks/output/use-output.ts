import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/commons/constants/query-key";
import { useQuery } from "@/app/_hooks/request/use-query";
import { getListOutputs, createOutput, updateOutput, deleteOutput } from "@/api/proker/aktivitas/output/api";
import { TProkerOutputPayload } from "@/api/proker/aktivitas/output/type";

export const useGetOutputs = (activityId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.output, activityId, params],
    queryFn: () => getListOutputs(activityId, params),
    enabled: !!activityId,
  });
};

export const useCreateOutput = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TProkerOutputPayload) => createOutput(activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.output, activityId] });
    },
  });
};

export const useUpdateOutput = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TProkerOutputPayload }) => updateOutput(activityId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.output, activityId] });
    },
  });
};

export const useDeleteOutput = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOutput(activityId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.output, activityId] });
    },
  });
};
