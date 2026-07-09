import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/commons/constants/query-key";
import { useQuery } from "@/app/_hooks/request/use-query";
import { getListProgress, createProgress } from "@/api/proker/aktivitas/progress/api";
import { TProkerProgressPayload } from "@/api/proker/aktivitas/progress/type";

export const useGetProgress = (activityId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.progress, activityId, params],
    queryFn: () => getListProgress(activityId, params),
    enabled: !!activityId,
  });
};

export const useCreateProgress = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TProkerProgressPayload) => createProgress(activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.progress, activityId] });
    },
  });
};
