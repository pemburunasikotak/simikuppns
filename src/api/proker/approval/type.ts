export type TSubmittedIndicatorProgram = {
  id: string;
  code?: string;
  title?: string;
  name?: string;
  description?: string;
  objective?: string;
  year?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TSubmittedIndicatorUnit = {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TSubmittedIndicatorItem = {
  id: string;
  name: string;
  status: string;
  programId?: string;
  unitId?: string;
  masterUnitTypeId?: string;
  targetQ1?: string;
  targetQ2?: string;
  targetQ3?: string;
  targetQ4?: string;
  budget?: string;
  order?: number;
  program?: TSubmittedIndicatorProgram;
  unit?: TSubmittedIndicatorUnit;
  createdAt: string;
  updatedAt: string;
};

export type TSubmittedIndicatorsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type TSubmittedIndicatorsResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TSubmittedIndicatorItem[];
    pagination: TSubmittedIndicatorsPagination;
  };
};

export type TApprovalActionPayload = {
  note: string;
};
