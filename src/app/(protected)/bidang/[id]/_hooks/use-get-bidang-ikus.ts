import { getBidangIkus } from "@/api/bidang";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetBidangIkus = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.bidang.detail, id, "ikus"],
    queryFn: () => getBidangIkus(id),
    enabled: !!id,
  });
};

export default useGetBidangIkus;
