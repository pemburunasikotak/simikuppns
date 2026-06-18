import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { syncBidangComponents } from "@/api/bidang";

const useSyncComponents = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentIds: string[]) => syncBidangComponents(bidangId, componentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "components"],
      });
      enqueueSnackbar("Berhasil menyinkronkan IKP ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menyinkronkan IKP", { variant: "error" });
    },
  });
};

export default useSyncComponents;
