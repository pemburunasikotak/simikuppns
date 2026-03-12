import { TDetailParams } from "@/api/common";
import { getDetailIKU } from "@/api/master/iku/index";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailAccessAdmin = (params?: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.iku.detail, params],
    queryFn: () => getDetailIKU(params),
  });
};

export default useGetDetailAccessAdmin;
