import { useQuery } from "@tanstack/react-query";
import { getIndicatorUsers } from "@/api/proker/program/api";

const useGetIndicatorUsers = (programId: string, indicatorId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["indicator-users", programId, indicatorId, params],
    queryFn: () => getIndicatorUsers(programId, indicatorId, params),
    enabled: !!programId && !!indicatorId,
  });
};

export default useGetIndicatorUsers;
