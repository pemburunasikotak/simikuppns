import { TDefaultProgramIndicator } from "../manajemenProgram/type";

export type TProkerProgram = {
  id: string;
  code: string;
  title: string;
  description?: string;
  objective?: string;
  year: number;
  unitId?: string;
  categoryId?: string;
  categoryName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  picId?: string;
  createdAt?: string;
  updatedAt?: string;
  indicators?: TDefaultProgramIndicator[];
};

export type TProkerProgramPayload = Omit<TProkerProgram, 'id' | 'createdAt' | 'updatedAt'>;

export type TProkerProgramResponse = {
  isSuccess: boolean;
  message: string;
  data: {
    items: TProkerProgram[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    }
  };
};

export type TProkerProgramDetailResponse = {
  isSuccess: boolean;
  message: string;
  data: TProkerProgram;
};

export type TProgramActivityPayload = {
  title: string;
  description: string;
  weight: number;
  startDate: string;
  endDate: string;
};

export type TSetProgramIndicatorTargetPayload = {
  targetQ1: number;
  targetQ2: number;
  targetQ3: number;
  targetQ4: number;
  budget: string;
  picIds: string[];
  pics: unknown[];
};

export type TAddIndicatorRealizationPayload = {
  month: number;
  realization: number;
  remark: string;
};

export type TIndicatorRealizationItem = {
  id: string;
  indicatorId: string;
  month: number;
  realization: number;
  remark: string;
  createdAt: string;
  updatedAt: string;
};
