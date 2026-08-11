import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveIndicator,
  rejectIndicator,
  revisionIndicator,
} from "@/api/proker/approval/api";
import { TApprovalActionPayload } from "@/api/proker/approval/type";

export const useApproveIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      approveIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-submitted-indicators"] });
    },
  });
};

export const useRejectIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      rejectIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-submitted-indicators"] });
    },
  });
};

export const useRevisionIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      revisionIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-submitted-indicators"] });
    },
  });
};
