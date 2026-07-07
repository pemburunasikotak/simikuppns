export type TProkerProgram = {
  id: string;
  name: string; description?: string; outputId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerProgramPayload = Omit<TProkerProgram, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerProgramResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerProgram[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
