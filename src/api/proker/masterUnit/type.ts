export type TProkerMasterUnit = {
  id: string;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerMasterUnitPayload = Omit<TProkerMasterUnit, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerMasterUnitResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerMasterUnit[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};
