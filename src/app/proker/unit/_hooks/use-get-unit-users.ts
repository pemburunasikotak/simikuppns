import { useQuery } from "@tanstack/react-query";
import { getUnitUsers } from "@/api/proker/unit/api";

const useGetUnitUsers = (unitId: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["proker/unit/users", unitId, params],
    queryFn: () => getUnitUsers(unitId, params),
    enabled: !!unitId,
  });
};

export default useGetUnitUsers;
