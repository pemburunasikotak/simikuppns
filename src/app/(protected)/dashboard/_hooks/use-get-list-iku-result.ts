import { getListIKUResult } from "@/api/iku-result";
import { TGetIKUResultParams } from "@/api/iku-result/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListIKUResult = (params?: TGetIKUResultParams) => {
  return useQuery({
    queryKey: [queryKeys.ikuResult.list, params],
    queryFn: () => getListIKUResult(params),
  });
};

export default useGetListIKUResult;
