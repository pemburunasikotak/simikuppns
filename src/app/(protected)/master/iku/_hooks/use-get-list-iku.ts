import { getListIKU } from "@/api/master/iku";
import { TGetIKUParams } from "@/api/master/iku/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListIKU = (params?: TGetIKUParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.iku.list, params],
    queryFn: () => getListIKU(params),
  });
};

export default useGetListIKU;
