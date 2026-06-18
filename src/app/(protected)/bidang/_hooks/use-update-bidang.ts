import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { updateBidang } from "@/api/bidang";
import { TBidangUpdateRequest } from "@/api/bidang/type";

const useUpdateBidang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TBidangUpdateRequest }) => updateBidang(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.list],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, variables.id],
      });
      enqueueSnackbar("Berhasil Memperbarui Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal Memperbarui Bidang", { variant: "error" });
    },
  });
};

export default useUpdateBidang;
