import { getListComponentRealization } from "@/api/master/component-realization";
import { TGetComponentRealizationParams } from "@/api/master/component-realization/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListComponentRealization = (params?: TGetComponentRealizationParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.componentRealization.list, params],
    queryFn: () => getListComponentRealization(params),
  });
};

export default useGetListComponentRealization;
