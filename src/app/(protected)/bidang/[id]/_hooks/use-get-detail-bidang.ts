import { getDetailBidang } from "@/api/bidang";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailBidang = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.bidang.detail, id],
    queryFn: () => getDetailBidang(id),
    enabled: !!id,
  });
};

export default useGetDetailBidang;
