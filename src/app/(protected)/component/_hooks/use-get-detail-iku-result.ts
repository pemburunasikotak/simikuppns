import { getDetailIKUResult } from "@/api/iku-result";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";
import { TIKUResultDetailResponse } from "@/api/iku-result/type";

interface TIKUDetailParams {
  id: string;
}

const useGetDetailIKUResult = (params: TIKUDetailParams, options?: { enabled?: boolean }) => {
  return useQuery<TIKUResultDetailResponse>({
    queryKey: [queryKeys.ikuResult.detail, params.id],
    queryFn: () => getDetailIKUResult(params.id),
    enabled: options?.enabled !== undefined ? options.enabled && !!params.id : !!params.id,
  });
};

export default useGetDetailIKUResult;
