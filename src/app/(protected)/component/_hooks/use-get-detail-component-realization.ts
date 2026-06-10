import { getDetailComponentRealization } from "@/api/master/component-realization";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";
import { TComponentRealizationDetailResponse } from "@/api/master/component-realization/type";

const useGetDetailComponentRealization = (params: TDetailParams, options?: { enabled?: boolean }) => {
  return useQuery<TComponentRealizationDetailResponse>({
    queryKey: [queryKeys.masterData.componentRealization.detail, params],
    queryFn: () => getDetailComponentRealization(params),
    enabled: options?.enabled !== undefined ? options.enabled && !!params.id : !!params.id,
  });
};

export default useGetDetailComponentRealization;
