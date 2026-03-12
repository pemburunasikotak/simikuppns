import { queryKeys } from "@/commons/constants/query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TErrorResponse } from "@/commons/types/response";
import { deleteFormula } from "@/api/master/iku";

const useDeleteFormula = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id: string }) => deleteFormula(params.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.list],
            });
            enqueueSnackbar("Berhasil Menghapus Formula", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.errors, { variant: "error" });
        },
    });
};

export default useDeleteFormula;
