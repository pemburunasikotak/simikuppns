import { getVerificationDashboard } from "@/api/verification";
import { TGetVerificationDashboardParams } from "@/api/verification/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetVerificationDashboard = (params: TGetVerificationDashboardParams) => {
  return useQuery({
    queryKey: [queryKeys.verification.dashboard, params.year],
    queryFn: () => getVerificationDashboard(params),
  });
};

export default useGetVerificationDashboard;
