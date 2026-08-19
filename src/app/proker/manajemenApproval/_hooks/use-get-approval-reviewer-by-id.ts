import { useQuery } from "@tanstack/react-query";
import { getApprovalReviewerById } from "@/api/proker/approvalReviewer/api";
import { TApprovalReviewerDetailResponse } from "@/api/proker/approvalReviewer/type";

export const useGetApprovalReviewerById = (id?: string) => {
  return useQuery<TApprovalReviewerDetailResponse>({
    queryKey: ["proker-approval-reviewer-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const response = await getApprovalReviewerById(id);
      return response;
    },
    enabled: !!id,
  });
};

export default useGetApprovalReviewerById;
