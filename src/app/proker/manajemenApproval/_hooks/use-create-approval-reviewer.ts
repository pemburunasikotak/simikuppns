import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createApprovalReviewer } from "@/api/proker/approvalReviewer/api";
import { TApprovalReviewerPayload } from "@/api/proker/approvalReviewer/type";

export const useCreateApprovalReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TApprovalReviewerPayload) => createApprovalReviewer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approval-reviewers"] });
    },
  });
};

export default useCreateApprovalReviewer;
