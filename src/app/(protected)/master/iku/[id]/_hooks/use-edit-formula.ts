import { queryKeys } from "@/commons/constants/query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TErrorResponse } from "@/commons/types/response";
import { editFormula } from "@/api/master/iku";
import { TIKUFormulaCreateRequest } from "@/api/master/iku/type";

const useEditFormula = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: TIKUFormulaCreateRequest }) => editFormula(id, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.list],
            });
            enqueueSnackbar("Berhasil Mengubah Formula", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Mengubah Formula", { variant: "error" });
        },
    });
};

export default useEditFormula;
