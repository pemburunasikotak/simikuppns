import { useQuery } from "@tanstack/react-query";
import { getUnitPrograms } from "@/api/proker/unit/api";

export default function useGetUnitPrograms(unitId: string, year: number | string = 2026) {
  return useQuery({
    queryKey: ["proker-unit-programs", unitId, year],
    queryFn: () => getUnitPrograms(unitId, { year }),
    enabled: !!unitId,
  });
}
