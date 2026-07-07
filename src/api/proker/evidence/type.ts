export type TProkerEvidence = {
  id: string;
  progressId?: string; fileName?: string; fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerEvidencePayload = Omit<TProkerEvidence, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerEvidenceResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerEvidence[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};
