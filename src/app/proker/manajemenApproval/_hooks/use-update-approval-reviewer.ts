import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateApprovalReviewer } from "@/api/proker/approvalReviewer/api";
import { TApprovalReviewerPayload } from "@/api/proker/approvalReviewer/type";

export const useUpdateApprovalReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TApprovalReviewerPayload> }) =>
      updateApprovalReviewer(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approval-reviewers"] });
      queryClient.invalidateQueries({ queryKey: ["proker-approval-reviewer-detail"] });
    },
  });
};

export default useUpdateApprovalReviewer;
