import { getListIKU } from "@/api/master/iku/index";
import { TIKUFilter } from "@/api/master/iku/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListFacilities = (params?: TIKUFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.facilities.list, params],
    queryFn: () => getListIKU(params),
  });
};

export default useGetListFacilities;
