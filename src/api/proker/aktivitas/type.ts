export type TProkerAktivitas = {
  id: string;
  title: string;
  description?: string;
  weight?: number;
  status?: string;
  programId?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerAktivitasPayload = Omit<TProkerAktivitas, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

export type TProkerAktivitasResponse = {
  isSuccess: boolean;
  message: string;
  data: TProkerAktivitas[];
};
