import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { TDetailParams } from "@/api/common";
import { deleteComponent } from "@/api/master/component";

const useDeleteComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TDetailParams) => deleteComponent(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.component.list],
      });
      enqueueSnackbar("Berhasil Menghapus Component", { variant: "success" });
    },
    onError: (error: TErrorResponse) => {
      enqueueSnackbar(error.response?.data.errors, { variant: "error" });
    },
  });
};

export default useDeleteComponent;
