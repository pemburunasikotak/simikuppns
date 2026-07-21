import { getUnits } from "@/api/unit";
import { TGetUnitsParams } from "@/api/unit/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListUnit = (params?: TGetUnitsParams) => {
  return useQuery({
    queryKey: [queryKeys.unit.list, params],
    queryFn: () => getUnits(params || {}),
  });
};

export default useGetListUnit;
