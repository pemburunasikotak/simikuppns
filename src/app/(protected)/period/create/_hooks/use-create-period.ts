import { useMutation } from "@tanstack/react-query";
import { TPeriodCreateRequest } from "@/api/period/type";
import { createPeriod } from "@/api/period";

const useCreatePeriod = () => {
  return useMutation({
    mutationFn: (payload: TPeriodCreateRequest) => createPeriod(payload),
    onSuccess: (res) => {
      return res;
    },
    onError: (error) => {
      return error;
    },
  });
};

export default useCreatePeriod;
