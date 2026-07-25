export type TDefaultProgramIndicator = {
  id: string;
  defaultProgramId: string;
  unitId?: string;
  name: string;
  unit: string;
  targetQ1?: number;
  targetQ2?: number;
  targetQ3?: number;
  targetQ4?: number;
  status?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TDefaultProgram = {
  id: string;
  ikuId: string;
  ikuCode: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  indicators?: TDefaultProgramIndicator[];
};

export type TDefaultProgramPayload = {
  ikuId: string;
  ikuCode: string;
  title: string;
  description: string;
  indicators?: {
    name: string;
    unit: string;
    order: number;
    status?: string;
  }[];
};

export type TDefaultProgramResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TDefaultProgram[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};

export type TProkerIku = {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  isDirectInput: boolean;
  unit: string;
  createdAt: string;
  updatedAt: string;
};

export type TProkerIkuListResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerIku[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};

export type TAssignDefaultProgramPayload = {
  unitId: string;
  defaultProgramId: string;
  period: number;
};

export type TAssignDefaultProgramIndicatorPayload = {
  unitId: string;
  defaultProgramIndicatorId: string;
  period: number;
};

export type TDefaultProgramIndicatorPayload = {
  unitId: string;
  name: string;
  unit: string;
  targetQ1: number;
  targetQ2: number;
  targetQ3: number;
  targetQ4: number;
  status: string;
  order: number;
};

export type TDefaultProgramIndicatorResponse = {
  isSuccess: boolean;
  message: string;
  data: TDefaultProgramIndicator[];
};
