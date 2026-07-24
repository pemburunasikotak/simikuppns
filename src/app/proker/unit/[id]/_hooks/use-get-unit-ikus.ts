import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";

export const getUnitIKUs = async (unitId: string): Promise<unknown> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${unitId}/ikus`);
  return data;
};

export default function useGetUnitIKUs(unitId: string) {
  return useQuery({
    queryKey: ["proker-unit-ikus", unitId],
    queryFn: () => getUnitIKUs(unitId),
    enabled: !!unitId,
  });
}
