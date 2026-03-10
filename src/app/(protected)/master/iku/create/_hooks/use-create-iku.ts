import { useMutation } from "@tanstack/react-query";
import { TIKUCreateRequest } from "@/api/master/iku/type";
import { createIKU } from "@/api/master/iku";

const useCreateIKU = () => {
  return useMutation({
    mutationFn: (payload: TIKUCreateRequest) => createIKU(payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useCreateIKU;
