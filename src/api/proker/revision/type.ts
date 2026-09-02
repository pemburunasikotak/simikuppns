export type TRevisionIndicatorProgram = {
  id: string;
  title: string;
};

export type TRevisionIndicatorUnit = {
  id: string;
  name: string;
  code?: string;
};

export type TRevisionIndicatorItem = {
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
  proposalDocumentId?: string;
  rabDocumentId?: string;
  program?: TRevisionIndicatorProgram;
  unit?: TRevisionIndicatorUnit;
  revisionLevel?: string;
  revisionNote?: string;
  revisionRequestedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TRevisionIndicatorsPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type TRevisionIndicatorsResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TRevisionIndicatorItem[];
    pagination: TRevisionIndicatorsPagination;
  };
};

export type TReviseIndicatorPayload = {
  targetQ1: number;
  targetQ2: number;
  targetQ3: number;
  targetQ4: number;
  budget?: string | number;
  propsal?: string;
  rab?: string;
  proposalDocumentId?: string;
  rabDocumentId?: string;
};
