import { getUnitIKUs } from "@/api/unit";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetUnitIKUs = (unitId: string) => {
  return useQuery({
    queryKey: [queryKeys.unit.ikus, unitId],
    queryFn: () => getUnitIKUs(unitId),
    enabled: !!unitId,
  });
};

export default useGetUnitIKUs;
