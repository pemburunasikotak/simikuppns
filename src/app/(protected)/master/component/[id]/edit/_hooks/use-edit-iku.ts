import { TDetailParams } from "@/api/common";
import { useMutation } from "@tanstack/react-query";
import { TComponentCreateRequest } from "@/api/master/component/type";
import { editComponent } from "@/api/master/component";

const useEditComponent = (params: TDetailParams) => {
  return useMutation({
    mutationFn: (payload: TComponentCreateRequest) => editComponent(params, payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useEditComponent;
