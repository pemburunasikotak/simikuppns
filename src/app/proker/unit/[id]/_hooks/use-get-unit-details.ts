import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";
import { TProkerUnit } from "@/api/proker/unit/type";

type TUnitDetailResponse = {
  unit: TProkerUnit;
  users: Record<string, unknown>[];
  ikus: Record<string, unknown>[];
};

export const getUnitDetails = async (unitId: string): Promise<TUnitDetailResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${unitId}/details`);
  // Handle both standard axios response wrapping and custom api wrappers
  return data?.data || data;
};

export default function useGetUnitDetails(unitId: string) {
  return useQuery({
    queryKey: ["proker-unit-details", unitId],
    queryFn: () => getUnitDetails(unitId),
    enabled: !!unitId,
  });
}
