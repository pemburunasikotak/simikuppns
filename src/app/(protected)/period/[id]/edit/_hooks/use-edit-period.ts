import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TDetailParams } from "@/api/common";
import { TPeriodUpdateRequest } from "@/api/period/type";
import { editPeriod } from "@/api/period";
import { queryKeys } from "@/commons/constants/query-key";

const useEditPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      params,
      req,
    }: {
      params: TDetailParams;
      req: TPeriodUpdateRequest;
    }) => editPeriod(params, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.period.list],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useEditPeriod;
