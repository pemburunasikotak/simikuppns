export interface TGuideItem {
  id: string;
  title: string;
  description: string | null;
  filename: string | null;
  originalName: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  size: number | null;
  videoUrl: string | null;
  videoSource: "YOUTUBE" | "GOOGLE_DRIVE" | string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TGetGuidesParams {
  page?: number;
  limit?: number;
  search?: string;
  search_value?: string;
}

export interface TGetGuidesResponse {
  success: boolean;
  data: {
    data: TGuideItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface TGuideDetailResponse {
  success: boolean;
  data: TGuideItem;
}

export interface TCreateGuidePayload {
  title: string;
  description?: string;
  videoUrl?: string;
  file?: File | null;
}

export interface TUpdateGuidePayload {
  id: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  file?: File | null;
}
