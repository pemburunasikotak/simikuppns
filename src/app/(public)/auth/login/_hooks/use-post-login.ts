import { postLogin } from "@/api/auth/api";
import { TLoginParam, TLoginResponse } from "@/api/auth/type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const usePostLogin = (): UseMutationResult<
  TLoginResponse,
  unknown,
  TLoginParam,
  unknown
> => {
  return useMutation({
    mutationKey: ["post-login"],
    mutationFn: postLogin,
  });
};
