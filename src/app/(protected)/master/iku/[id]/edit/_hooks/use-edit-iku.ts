import { TDetailParams } from "@/api/common";
import { useMutation } from "@tanstack/react-query";
import { TIKUUpdateRequest } from "@/api/master/iku/type";
import { editIKU } from "@/api/master/iku";

const useEditIKU = (params: TDetailParams) => {
  return useMutation({
    mutationFn: (payload: TIKUUpdateRequest) => editIKU(params, payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useEditIKU;
