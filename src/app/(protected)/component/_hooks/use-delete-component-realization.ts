import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { TDetailParams } from "@/api/common";
import { deleteComponentRealization } from "@/api/master/component-realization";

const useDeleteComponentRealization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TDetailParams) => deleteComponentRealization(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.componentRealization.list],
      });
      enqueueSnackbar("Berhasil Menghapus Realisasi Komponen", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.errors, { variant: "error" });
    },
  });
};

export default useDeleteComponentRealization;
