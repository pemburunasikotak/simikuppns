export interface TProkerGuideItem {
  id: string;
  title: string;
  description?: string | null;
  fileName?: string | null;
  filename?: string | null;
  originalName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  size?: number | null;
  url?: string | null;
  fileUrl?: string | null;
  videoUrl?: string | null;
  videoSource?: "YOUTUBE" | "GOOGLE_DRIVE" | string | null;
  uploadedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TGetProkerGuidesParams {
  page?: number;
  limit?: number;
  search?: string;
  search_value?: string;
}

export interface TGetProkerGuidesResponse {
  isSuccess?: boolean;
  success?: boolean;
  message?: string;
  data: {
    items?: TProkerGuideItem[];
    data?: TProkerGuideItem[];
    pagination?: {
      page: number;
      limit: number;
      totalItems?: number;
      total?: number;
      totalPages?: number;
    };
  };
}

export interface TProkerGuideDetailResponse {
  isSuccess?: boolean;
  success?: boolean;
  message?: string;
  data: TProkerGuideItem;
}

export interface TCreateProkerGuidePayload {
  title: string;
  description?: string;
  videoUrl?: string;
  file?: File | null;
}

export interface TUpdateProkerGuidePayload {
  id: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  file?: File | null;
}
