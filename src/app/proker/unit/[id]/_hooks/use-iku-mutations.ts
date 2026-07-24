import { useMutation, useQueryClient } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";

export const assignIKUsToUnit = async (
  unitId: string,
  body: { ikuIds: string[] }
): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.post(`/api/v1/units/${unitId}/ikus/assign`, body);
  return data;
};

export const unassignIKUsFromUnit = async (
  unitId: string,
  body: { ikuIds: string[] }
): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.delete(`/api/v1/units/${unitId}/ikus/unassign`, { data: body });
  return data;
};

export function useAssignIKUs(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { ikuIds: string[] }) => assignIKUsToUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-unit-ikus", unitId] });
      queryClient.invalidateQueries({ queryKey: ["proker-unit-details", unitId] });
    },
  });
}

export function useUnassignIKUs(unitId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { ikuIds: string[] }) => unassignIKUsFromUnit(unitId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proker-unit-ikus", unitId] });
      queryClient.invalidateQueries({ queryKey: ["proker-unit-details", unitId] });
    },
  });
}
