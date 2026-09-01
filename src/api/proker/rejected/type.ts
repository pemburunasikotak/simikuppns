export type TRejectedIndicatorProgram = {
  id: string;
  title: string;
};

export type TRejectedIndicatorUnit = {
  id: string;
  name: string;
  code?: string;
};

export type TRejectedIndicatorItem = {
  id: string;
  name: string;
  status: string;
  category?: string;
  targetQ1?: number;
  targetQ2?: number;
  targetQ3?: number;
  targetQ4?: number;
  budget?: number | string;
  proposalURL?: string;
  rabURL?: string;
  program?: TRejectedIndicatorProgram;
  unit?: TRejectedIndicatorUnit;
  rejectionLevel?: string;
  rejectionNote?: string;
  rejectedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TRejectedIndicatorsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type TRejectedIndicatorsResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TRejectedIndicatorItem[];
    pagination: TRejectedIndicatorsPagination;
  };
};
