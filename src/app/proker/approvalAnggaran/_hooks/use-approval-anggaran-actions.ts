import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveIndicator,
  rejectIndicator,
  revisionIndicator,
} from "@/api/proker/approval/api";
import { TApprovalActionPayload } from "@/api/proker/approval/type";

export const useApproveAnggaranIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      approveIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approved-indicators"] });
    },
  });
};

export const useRejectAnggaranIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      rejectIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approved-indicators"] });
    },
  });
};

export const useRevisionAnggaranIndicator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TApprovalActionPayload }) =>
      revisionIndicator(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approved-indicators"] });
    },
  });
};
