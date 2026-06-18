import { getListBidang } from "@/api/bidang";
import { TGetBidangParams } from "@/api/bidang/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListBidang = (params?: TGetBidangParams) => {
  return useQuery({
    queryKey: [queryKeys.bidang.list, params],
    queryFn: () => getListBidang(params || {}),
  });
};

export default useGetListBidang;
