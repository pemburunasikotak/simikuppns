import { createTransaction } from "@/api/transactions/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateTransaction = () => {
  return useMutation({
    mutationKey: ["create-transaction"],
    mutationFn: createTransaction,
  });
};

export default useCreateTransaction;
