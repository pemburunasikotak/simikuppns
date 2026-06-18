import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { assignBidangUsers } from "@/api/bidang";

const useAssignUser = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => assignBidangUsers(bidangId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "users"],
      });
      enqueueSnackbar("Berhasil menambahkan user ke Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menambahkan user", { variant: "error" });
    },
  });
};

export default useAssignUser;

