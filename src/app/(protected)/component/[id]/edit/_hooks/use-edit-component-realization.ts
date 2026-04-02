import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TDetailParams } from "@/api/common";
import { TComponentRealizationUpdateRequest } from "@/api/master/component-realization/type";
import { editComponentRealization } from "@/api/master/component-realization";
import { queryKeys } from "@/commons/constants/query-key";

const useEditComponentRealization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      params,
      req,
    }: {
      params: TDetailParams;
      req: TComponentRealizationUpdateRequest;
    }) => editComponentRealization(params, req),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.masterData.componentRealization.list],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useEditComponentRealization;
