import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApprovalReviewer } from "@/api/proker/approvalReviewer/api";

export const useDeleteApprovalReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApprovalReviewer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-approval-reviewers"] });
    },
  });
};

export default useDeleteApprovalReviewer;
