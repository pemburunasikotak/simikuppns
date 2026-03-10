import { getListTransaction } from "@/api/dashboard";
import { TTransactionFilter } from "@/api/transactions/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListTransaction = (params?: TTransactionFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.facilities.list, params],
    queryFn: () => getListTransaction(params ?? {}),
  });
};

export default useGetListTransaction;
