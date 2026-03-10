import { getListTransaction } from "@/api/transactions/api";
import { TTransactionFilter } from "@/api/transactions/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListTransaction = (params?: TTransactionFilter) => {
  return useQuery({
    queryKey: [queryKeys.transactions.list, params],
    queryFn: getListTransaction,
  });
};

export default useGetListTransaction;
