import { assignIKUPics } from "@/api/master/iku";
import { TAssignIKUPicRequest } from "@/api/master/iku/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { queryKeys } from "@/commons/constants/query-key";
import { TErrorResponse } from "@/commons/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router";

const useAssignIKUPic = () => {
    const queryClient = useQueryClient();
    const params = useParams();

    return useMutation({
        mutationFn: ({ ikuId, req }: { ikuId: string; req: TAssignIKUPicRequest }) =>
            assignIKUPics(ikuId, req),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.masterData.iku.pic.list, params.id],
            });
            enqueueSnackbar("Berhasil Memperbarui PIC", { variant: "success" });
        },
        onError: (error: TErrorResponse) => {
            enqueueSnackbar(error.response?.data.message || "Gagal Memperbarui PIC", { variant: "error" });
        },
    });
};

export default useAssignIKUPic;
