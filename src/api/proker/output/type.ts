export type TProkerOutput = {
  id: string;
  name: string; description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerOutputPayload = Omit<TProkerOutput, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerOutputResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerOutput[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
