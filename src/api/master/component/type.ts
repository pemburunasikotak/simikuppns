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
    periodType: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
};

export type TComponentCreateRequest = {
    code: string;
    name: string;
    description: string;
    periodType: string;
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

// ─── Component Structure & Realization ────────────────────────────────────────

export type TComponentStructureItem = TComponentItem & {
    parentId: string | null;
    periodType: string;
    hasBreakdown: boolean;
    filterByLevel: boolean;
    tags: Array<{ id: string; name: string; color?: string }>;
    ikus: Array<{ id: string; code: string; name: string }>;
    realization: unknown;
    children: TComponentStructureItem[];
    breakdown?: Array<{
        prodi?: {
            id: string;
            code: string;
            name: string;
        };
        value?: number | null;
        target?: number | null;
    }>;
};

export type TComponentStructureResponse = TResponse<TComponentStructureItem>;

export type TProdiRealizationItem = {
    prodiId: string;
    prodiName: string;
    target: number;
    realization: number;
};

export type TComponentRealizationResponse = TResponse<{
    id: string;
    componentId: string;
    year: number;
    totalTarget: number;
    totalRealization: number;
    achievementPercentage: number;
    prodis: TProdiRealizationItem[];
}>;

// ─── Component PIC (Assignments) ──────────────────────────────────────────────

export type TComponentAssignmentItem = {
    id: string;
    componentId: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    user?: {
        id: string;
        name: string;
        nip: string;
        email: string;
        type: string;
    };
};

export type TComponentPicListResponse = {
    success: boolean;
    data: {
        component: TComponentItem & { periodType: string; hasBreakdown: boolean };
        assignments: TComponentAssignmentItem[];
    };
};

export type TAssignComponentPicRequest = {
    userIds: string[];
};