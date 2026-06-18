import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { unassignBidangIkus } from "@/api/bidang";

const useUnassignIku = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ikuIds: string[]) => unassignBidangIkus(bidangId, ikuIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "ikus"],
      });
      enqueueSnackbar("Berhasil melepas tautan IKU dari Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal melepas tautan IKU", { variant: "error" });
    },
  });
};

export default useUnassignIku;

