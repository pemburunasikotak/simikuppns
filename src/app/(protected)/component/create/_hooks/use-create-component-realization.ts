import { useMutation } from "@tanstack/react-query";
import { TComponentRealizationCreateRequest } from "@/api/master/component-realization/type";
import { createComponentRealization } from "@/api/master/component-realization";

const useCreateComponentRealization = () => {
  return useMutation({
    mutationFn: (payload: TComponentRealizationCreateRequest) =>
      createComponentRealization(payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useCreateComponentRealization;
