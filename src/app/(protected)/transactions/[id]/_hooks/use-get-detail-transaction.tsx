import { TDetailParams } from "@/api/common";
import { getDetailTransaction } from "@/api/transactions/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailTransaction = (params?: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.transactions.detail, params],
    queryFn: () => getDetailTransaction(params),
  });
};

export default useGetDetailTransaction;
