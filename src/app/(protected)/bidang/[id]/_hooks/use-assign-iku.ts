import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { assignBidangIkus } from "@/api/bidang";

const useAssignIku = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ikuIds: string[]) => assignBidangIkus(bidangId, ikuIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "ikus"],
      });
      enqueueSnackbar("Berhasil menautkan IKU ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menautkan IKU", { variant: "error" });
    },
  });
};

export default useAssignIku;

