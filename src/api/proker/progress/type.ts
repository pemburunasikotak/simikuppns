export type TProkerProgress = {
  id: string;
  aktivitasId?: string; percentage?: number; notes?: string; date?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerProgressPayload = Omit<TProkerProgress, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerProgressResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerProgress[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
