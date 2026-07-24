import { useMutation, useQueryClient } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";

type TAssignUserRequest = {
  users: Array<{
    userId: string;
    type: "PIC" | "MEMBER";
  }>;
};

export const assignUsersToUnit = async (
  unitId: string,
  body: TAssignUserRequest
): Promise<{ success: boolean; message?: string }> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/units/${unitId}/assign`, body);
  return data;
};

export default function useAssignUsers(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: TAssignUserRequest) => assignUsersToUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-unit-users", unitId] });
      queryClient.invalidateQueries({ queryKey: ["proker-unit-details", unitId] });
    },
  });
}
