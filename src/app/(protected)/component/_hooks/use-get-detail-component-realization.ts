import { getDetailComponentRealization } from "@/api/master/component-realization";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailComponentRealization = (params: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.componentRealization.detail, params],
    queryFn: () => getDetailComponentRealization(params),
    enabled: !!params.id,
  });
};

export default useGetDetailComponentRealization;
