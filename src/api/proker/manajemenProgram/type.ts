export type TDefaultProgram = {
  id: string;
  ikuId: string;
  ikuCode: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TDefaultProgramPayload = {
  ikuId: string;
  ikuCode: string;
  title: string;
  description: string;
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
