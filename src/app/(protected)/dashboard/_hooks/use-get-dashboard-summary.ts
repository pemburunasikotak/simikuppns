import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/api/dashboard";
import { TDashboardSummaryResponse } from "@/api/dashboard/type";

export default function useGetDashboardSummary(params: { year: number }) {
  return useQuery<TDashboardSummaryResponse>({
    queryKey: ["dashboard-summary", params],
    queryFn: () => getDashboardSummary(params),
  });
}
