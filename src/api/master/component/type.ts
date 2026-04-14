import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TComponentFilter = TFilterParams;

export type TComponentItem = {
    id: string;
    code: string;
    name: string;
    description: string;
    dataType: string;
    sourceType: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
};

export type TComponentCreateRequest = {
    code: string;
    name: string;
    description: string;
}

export type TComponentUpdateRequest = {
    code?: string;
    name?: string;
    description?: string;
}

export type TGetComponentParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
};

export type TComponentListResponse = TResponsePaginate<TComponentItem>;
export type TComponentDetailResponse = TResponse<TComponentItem>;

// ─── Component Target ────────────────────────────────────────────────────────

export type TComponentTargetItem = {
    id: string;
    componentId: string;
    year: number;
    targetQ1: string;
    targetQ2: string;
    targetQ3: string;
    targetQ4: string;
    targetYear: string;
    createdAt?: string;
    updatedAt?: string;
};

export type TComponentTargetCreateRequest = {
    componentId: string;
    year: number;
    targetQ1: number;
    targetQ2: number;
    targetQ3: number;
    targetQ4: number;
    targetYear: number;
};

export type TComponentTargetUpdateRequest = Partial<TComponentTargetCreateRequest>;

export type TComponentTargetListResponse = TResponse<TComponentTargetItem[]>;