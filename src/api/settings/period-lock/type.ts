export type TPeriodLockItem = {
  month: number;
  monthName: string;
  year: number;
  locked: boolean;
  allowAdminBypass: boolean;
  reason?: string;
  lockedBy?: string | null;
  lockedAt?: string | null;
};

export type TGetPeriodLockParams = {
  year: number;
};

export type TPeriodLockListResponse = {
  success?: boolean;
  data?: TPeriodLockItem[];
  result?: TPeriodLockItem[];
  message?: string;
};

export type TPeriodLockUpdateRequest = {
  month: number;
  year: number;
  locked: boolean;
  allowAdminBypass: boolean;
  reason?: string;
};

export type TPeriodLockBulkItem = {
  month: number;
  locked: boolean;
  allowAdminBypass?: boolean;
  reason?: string;
};

export type TPeriodLockBulkUpdateRequest = {
  year: number;
  locks: TPeriodLockBulkItem[];
};
