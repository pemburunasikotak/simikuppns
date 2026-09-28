export type TUnitBudgetProposal = {
  id: string;
  unitId: string;
  year: number;
  perbaikanDocumentId?: string | null;
  perbaikanURL?: string | null;
  perbaikanValue?: number;
  bahanHabisDocumentId?: string | null;
  bahanHabisURL?: string | null;
  bahanHabisValue?: number;
  peralatanDocumentId?: string | null;
  peralatanURL?: string | null;
  peralatanValue?: number;
  pelatihanDocumentId?: string | null;
  pelatihanURL?: string | null;
  pelatihanValue?: number;
  meubelairDocumentId?: string | null;
  meubelairURL?: string | null;
  meubelairValue?: number;
  totalValue?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  unit?: {
    id: string;
    name: string;
  };
};

export type TUnitBudgetProposalPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type TUnitBudgetProposalResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TUnitBudgetProposal[];
    pagination: TUnitBudgetProposalPagination;
  };
};

export type TSaveUnitBudgetProposalPayload = {
  perbaikanDocumentId?: string | null;
  perbaikanValue?: number;
  bahanHabisDocumentId?: string | null;
  bahanHabisValue?: number;
  peralatanDocumentId?: string | null;
  peralatanValue?: number;
  pelatihanDocumentId?: string | null;
  pelatihanValue?: number;
  meubelairDocumentId?: string | null;
  meubelairValue?: number;
};
