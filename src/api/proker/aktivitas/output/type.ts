export type TProkerOutput = {
  id: string;
  activityId: string;
  metricType: string;
  target: number;
  realization: number;
  unit: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TProkerOutputPayload = {
  metricType: string;
  target: number;
  realization: number;
  unit: string;
  description?: string;
};

export type TProkerOutputResponse = {
  isSuccess: boolean;
  message: string;
  data: TProkerOutput[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
