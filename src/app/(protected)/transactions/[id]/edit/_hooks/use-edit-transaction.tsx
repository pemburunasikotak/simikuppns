import { TDetailParams } from "@/api/common";
import { editTransaction } from "@/api/transactions/api";
import { TTransactionRequest } from "@/api/transactions/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditTransaction = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-transaction"],
    mutationFn: (req: TTransactionRequest) => editTransaction(params, req),
  });
};

export default useEditTransaction;
