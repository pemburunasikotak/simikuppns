import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { createBidang } from "@/api/bidang";
import { TBidangCreateRequest } from "@/api/bidang/type";

const useCreateBidang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TBidangCreateRequest) => createBidang(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.list],
      });
      enqueueSnackbar("Berhasil Menambah Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal Menambah Bidang", { variant: "error" });
    },
  });
};

export default useCreateBidang;
