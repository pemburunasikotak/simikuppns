import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { unassignBidangComponents } from "@/api/bidang";

const useUnassignComponent = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentIds: string[]) => unassignBidangComponents(bidangId, componentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "components"],
      });
      enqueueSnackbar("Berhasil melepas tautan IKP dari Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal melepas tautan IKP", { variant: "error" });
    },
  });
};

export default useUnassignComponent;
