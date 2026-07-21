// ─── Unit Types ──────────────────────────────────────────────────────────────

export type TUnitItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  data: TUnitItem[];
};

export type TUnitCreateRequest = {
  name: string;
  description: string;
};

export type TUnitUpdateRequest = {
  name?: string;
  description?: string;
};

export type TUnitListResponse = {
  success: boolean;
  message?: string;
  data: TUnitItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type TGetUnitsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// ─── Unit Users Types ─────────────────────────────────────────────────────────

export type TUnitUserItem = {
  id: string;
  email: string | null;
  name: string;
  nip: string;
  type: string;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  memberType: "PIC" | "MEMBER";
};

export type TUnitUsersResponse = {
  success: boolean;
  data: TUnitUserItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TGetUnitUsersParams = {
  page?: number;
  limit?: number;
};

// ─── Assign User Types ────────────────────────────────────────────────────────

export type TAssignUserRequest = {
  users: Array<{
    userId: string;
    type: "PIC" | "MEMBER";
  }>;
};

// ─── Unit IKU Types ───────────────────────────────────────────────────────────

export type TUnitIKUItem = {
  id: string;
  code?: string;
  name: string;
};

export type TUnitIKUsResponse = {
  success: boolean;
  data: {
    unit: TUnitItem;
    ikus: Array<{
      id: string;
      unitId: string;
      ikuId: string;
      createdAt: string;
      iku: TUnitIKUItem;
    }>;
  };
  message?: string;
};

export type TAssignIKURequest = {
  ikuIds: string[];
};
