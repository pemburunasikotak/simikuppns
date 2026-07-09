import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/commons/constants/query-key";
import { useQuery } from "@/app/_hooks/request/use-query";
import { getListEvidences, createEvidence, deleteEvidence } from "@/api/proker/aktivitas/evidence/api";

export const useGetEvidences = (activityId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: [queryKeys.proker.evidence, activityId, params],
    queryFn: () => getListEvidences(activityId, params),
    enabled: !!activityId,
  });
};

export const useCreateEvidence = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => createEvidence(activityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.evidence, activityId] });
    },
  });
};

export const useDeleteEvidence = (activityId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvidence(activityId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.proker.evidence, activityId] });
    },
  });
};
