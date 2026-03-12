import { TDetailParams } from "@/api/common";
import { queryKeys } from "@/commons/constants/query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { TErrorResponse } from "@/commons/types/response";
import { createComponent } from "@/api/master/iku";

export type ComponentCreatePayload = {
    id: string;
};

type CreateComponentParams = {
    params: TDetailParams;
    req: ComponentCreatePayload;
};

const useCreateComponent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // @ts-ignore
        mutationFn: ({ params, req }: CreateComponentParams) => createComponent(params, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.list], // Will invalidate everything under iku
            });
            enqueueSnackbar("Berhasil Menambahkan Komponen", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            console.log("CEK ERROR", error);
            enqueueSnackbar(error.response?.data.message || "Gagal Menambahkan Komponen", { variant: "error" });
        },
    });
};

export default useCreateComponent;
