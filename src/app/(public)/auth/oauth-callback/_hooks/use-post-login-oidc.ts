import { postLoginOidc } from "@/api/auth/api";
import { TLoginOidcParam } from "@/api/auth/type";
import { useMutation } from "@tanstack/react-query";

export const usePostLoginOidc = () => {
  return useMutation({
    mutationKey: ["post-login-oidc"],
    mutationFn: (payload: TLoginOidcParam) => postLoginOidc(payload),
  });
};
