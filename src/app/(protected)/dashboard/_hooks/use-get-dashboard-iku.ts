import { getDashboardIKU } from "@/api/dashboard";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDashboardIKU = (params: { year: number }) => {
  return useQuery({
    queryKey: [queryKeys.dashboard.iku, params.year],
    queryFn: () => getDashboardIKU(params),
  });
};

export default useGetDashboardIKU;
