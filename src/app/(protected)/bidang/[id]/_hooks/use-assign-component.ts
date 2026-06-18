import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { assignBidangComponents } from "@/api/bidang";

const useAssignComponent = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (componentIds: string[]) => assignBidangComponents(bidangId, componentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "components"],
      });
      enqueueSnackbar("Berhasil menautkan IKP ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menautkan IKP", { variant: "error" });
    },
  });
};

export default useAssignComponent;
