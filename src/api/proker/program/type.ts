export type TProkerProgram = {
  id: string;
  code: string;
  title: string;
  description?: string;
  objective?: string;
  year: number;
  unitId?: string;
  categoryId?: string;
  categoryName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  picId?: string;
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

export type TProgramActivityPayload = {
  title: string;
  description: string;
  weight: number;
  startDate: string;
  endDate: string;
};

