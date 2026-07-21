import { getUnitUsers } from "@/api/unit";
import { TGetUnitUsersParams } from "@/api/unit/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetUnitUsers = (unitId: string, params?: TGetUnitUsersParams) => {
  return useQuery({
    queryKey: [queryKeys.unit.users, unitId, params],
    queryFn: () => getUnitUsers(unitId, params || {}),
    enabled: !!unitId,
  });
};

export default useGetUnitUsers;
