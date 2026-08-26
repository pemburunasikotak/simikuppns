export type TProkerUnit = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProkerUnitPayload = Omit<TProkerUnit, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerUnitResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerUnit[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};

export type TUnitProgramIndikatorRealization = {
  id: string;
  month: number;
  realization: number;
  remark?: string;
};

export type TUnitProgramIndikator = {
  id: string;
  name: string;
  category?: string;
  masterUnitType?: {
    id?: string;
    name?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  targetQ1?: number;
  targetQ2?: number;
  targetQ3?: number;
  targetQ4?: number;
  budget?: number;
  status?: string;
  order?: number;
  picIds?: string[];
  realizations?: TUnitProgramIndikatorRealization[];
};

export type TUnitProgramItem = {
  program: {
    id: string;
    code: string;
    title: string;
    description?: string;
    objective?: string;
    year: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  indikator: TUnitProgramIndikator[];
};

