import { postChangePassword } from "@/api/auth/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useChangeProfilePassword = () => {
  return useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) =>
      postChangePassword(payload),
  });
};

export default useChangeProfilePassword;
