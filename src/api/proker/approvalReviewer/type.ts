export type TApprovalReviewerItem = {
  id: string;
  userId: string;
  level: string;
  ikuId: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  iku?: {
    id: string;
    code?: string;
    name?: string;
    title?: string;
  };
};

export type TApprovalReviewerPayload = {
  userId: string;
  level: string;
  ikuIds: string[];
};

export type TApprovalReviewerResponse = {
  isSuccess: boolean;
  message: string;
  data:
    | TApprovalReviewerItem[]
    | {
        items: TApprovalReviewerItem[];
        pagination?: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
        };
      };
};

export type TApprovalReviewerDetailResponse = {
  isSuccess: boolean;
  message: string;
  data: TApprovalReviewerItem;
};
