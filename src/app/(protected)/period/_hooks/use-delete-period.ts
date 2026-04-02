import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { TDetailParams } from "@/api/common";
import { deletePeriod } from "@/api/period";

const useDeletePeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TDetailParams) => deletePeriod(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.period.list],
      });
      enqueueSnackbar("Berhasil Menghapus Periode", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.errors, { variant: "error" });
    },
  });
};

export default useDeletePeriod;
