export type TProkerUnit = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerUnitPayload = Omit<TProkerUnit, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerUnitResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerUnit[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
