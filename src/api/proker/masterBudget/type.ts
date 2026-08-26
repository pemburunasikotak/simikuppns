export type TProkerMasterBudget = {
  year: number;
  budget: number;
  realization: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TCreateMasterBudgetPayload = {
  year: number;
  budget: number;
  realization: number;
};

export type TUpdateMasterBudgetTotalPayload = {
  budget: number;
};

export type TUpdateMasterBudgetRealizationPayload = {
  realization: number;
};

export type TProkerMasterBudgetResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerMasterBudget[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};
