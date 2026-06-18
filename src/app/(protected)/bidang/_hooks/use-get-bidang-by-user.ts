import { getBidangByUser } from "@/api/bidang";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetBidangByUser = (userId: string) => {
  return useQuery({
    queryKey: [queryKeys.bidang.byUser, userId],
    queryFn: () => getBidangByUser(userId),
    enabled: !!userId,
  });
};

export default useGetBidangByUser;
