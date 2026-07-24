import { useQuery } from "@tanstack/react-query";
import prokerAxiosInstance from "@/libs/axios/proker-config";

export type TUnitUserItem = {
  id: string;
  email: string | null;
  name: string;
  nip: string;
  type: string;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  memberType?: "PIC" | "MEMBER";
  items?: TUnitUserItem;
};

type TUnitUsersResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TUnitUserItem[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};

export const getUnitUsers = async (
  unitId: string,
  params: Record<string, unknown>
): Promise<TUnitUsersResponse> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/units/${unitId}/users`, { params });
  return data;
};

export default function useGetUnitUsers(unitId: string, params: Record<string, unknown>) {
  return useQuery({
    queryKey: ["proker-unit-users", unitId, params],
    queryFn: () => getUnitUsers(unitId, params),
    enabled: !!unitId,
  });
}
