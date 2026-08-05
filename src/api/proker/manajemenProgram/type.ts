export type TDefaultProgramIndicator = {
  id: string;
  defaultProgramId?: string;
  programId?: string;
  unitId?: string;
  name: string;
  unit?: {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  } | string;
  masterUnitType?: {
    id: string;
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  } | string;
  unit_measurement?: string;
  targetQ1?: number;
  targetQ2?: number;
  targetQ3?: number;
  targetQ4?: number;
  status?: string;
  order: number;
  pics?: {
    id: string;
    indicatorId: string;
    userId: string;
    createdAt?: string;
  }[];
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

export type TIkuUnit = {
  id: string;
  name?: string;
  unit?: {
    id: string;
    name: string;
  };
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
  masterUnitTypeId: string;
  unitId: string;
  name: string;
  unit?: string;
  targetQ1: number;
  targetQ2: number;
  targetQ3: number;
  targetQ4: number;
  status: string;
  order: number;
  budget?: number;
  picIds?: string[];
  propsal?: unknown;
  rab?: unknown;
};

export type TDefaultProgramIndicatorResponse = {
  isSuccess: boolean;
  message: string;
  data: TDefaultProgramIndicator[];
};

export type TCreateDefaultProgramIndicatorPayload = {
  name: string;
  unit: string;
  order: number;
};

export type TAssignmentStructureIndicator = {
  id: string;
  name: string;
  unit: string;
  order: number;
  assignedUnits: {
    unitId: string;
    unitName: string;
  }[];
  isAssigned: boolean;
};

export type TAssignmentStructureProgram = {
  id: string;
  title: string;
  description: string;
  order: number;
  indicators: TAssignmentStructureIndicator[];
};

export type TAssignmentStructureItem = {
  iku: {
    id: string;
    code: string;
    name: string;
    description: string;
  };
  totalPrograms: number;
  totalIndicators: number;
  programs: TAssignmentStructureProgram[];
};

export type TAssignmentStructureResponse = {
  isSuccess?: boolean;
  message?: string;
  items?: TAssignmentStructureItem[];
  data?: {
    items: TAssignmentStructureItem[];
  }
};

export type TAssignIndicatorToUnitPayload = {
  unitId: string;
  defaultProgramIndicatorId: string;
  period: number;
};
