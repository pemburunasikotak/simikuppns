import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { syncBidangUsers } from "@/api/bidang";

const useSyncUsers = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => syncBidangUsers(bidangId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "users"],
      });
      enqueueSnackbar("Berhasil menyinkronkan user ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menyinkronkan user", { variant: "error" });
    },
  });
};

export default useSyncUsers;
