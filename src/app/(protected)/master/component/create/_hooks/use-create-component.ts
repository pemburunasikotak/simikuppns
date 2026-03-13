import { useMutation } from "@tanstack/react-query";
import { TComponentCreateRequest } from "@/api/master/component/type";
import { createComponent } from "@/api/master/component";

const useCreateComponent = () => {
  return useMutation({
    mutationFn: (payload: TComponentCreateRequest) => createComponent(payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useCreateComponent;

