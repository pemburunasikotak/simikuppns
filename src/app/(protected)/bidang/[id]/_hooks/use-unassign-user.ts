import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { unassignBidangUsers } from "@/api/bidang";

const useUnassignUser = (bidangId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: string[]) => unassignBidangUsers(bidangId, userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.bidang.detail, bidangId, "users"],
      });
      enqueueSnackbar("Berhasil menghapus user dari Bidang", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.message || "Gagal menghapus user", { variant: "error" });
    },
  });
};

export default useUnassignUser;

