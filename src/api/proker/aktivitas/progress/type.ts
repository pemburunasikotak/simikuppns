export type TProkerProgress = {
  id: string;
  activityId: string;
  progress: number;
  note: string;
  createdBy: string;
  createdAt: string;
};

export type TProkerProgressPayload = {
  progress: number;
  note: string;
};

export type TProkerProgressResponse = {
  isSuccess: boolean;
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  data: TProkerProgress[];
};
