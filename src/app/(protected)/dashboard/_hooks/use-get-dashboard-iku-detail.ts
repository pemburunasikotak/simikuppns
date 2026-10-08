import { getDashboardIKUDetail } from "@/api/dashboard";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDashboardIKUDetail = (id: string, params: { year: number }, enabled: boolean = true) => {
  return useQuery({
    queryKey: [queryKeys.dashboard.iku, id, params.year],
    queryFn: () => getDashboardIKUDetail(id, params),
    enabled,
  });
};

export default useGetDashboardIKUDetail;
