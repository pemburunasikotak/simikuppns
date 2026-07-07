export type TProkerAktivitas = {
  id: string;
  name: string; description?: string; programId?: string; startDate?: string; endDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerAktivitasPayload = Omit<TProkerAktivitas, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerAktivitasResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerAktivitas[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
