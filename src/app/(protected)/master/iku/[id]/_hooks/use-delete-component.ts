import { TDetailParams } from "@/api/common";
import { queryKeys } from "@/commons/constants/query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TErrorResponse } from "@/commons/types/response";
import { deleteIKU } from "@/api/master/iku";

const useDeleteComponent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: TDetailParams) => deleteIKU(params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.list],
            });
            enqueueSnackbar("Berhasil Menghapus IKU", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.errors, { variant: "error" });
        },
    });
};

export default useDeleteComponent;
