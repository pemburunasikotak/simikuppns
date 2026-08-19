import { useQuery } from "@tanstack/react-query";
import { getApprovalReviewers } from "@/api/proker/approvalReviewer/api";
import { TApprovalReviewerResponse } from "@/api/proker/approvalReviewer/type";

export const useGetApprovalReviewers = (params?: Record<string, unknown>) => {
  return useQuery<TApprovalReviewerResponse>({
    queryKey: ["proker-approval-reviewers", params],
    queryFn: async () => {
      const response = await getApprovalReviewers(params);
      return response;
    },
  });
};

export default useGetApprovalReviewers;
