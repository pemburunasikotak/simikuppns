import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { syncBidangIkus } from "@/api/bidang";

const useSyncIkus = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ikuIds: string[]) => syncBidangIkus(bidangId, ikuIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "ikus"],
      });
      enqueueSnackbar("Berhasil menyinkronkan IKU ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menyinkronkan IKU", { variant: "error" });
    },
  });
};

export default useSyncIkus;
