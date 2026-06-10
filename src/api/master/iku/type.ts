import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TIKUFilter = TFilterParams;

export type TIKUItem = {
    id: string;
    code: string;
    name: string;
    description: string;
    isDirectInput: boolean;
    unit: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
};

export type TIKUCreateRequest = {
    code: string;
    name: string;
    description: string;
    isDirectInput: boolean;
    unit: string;
}

export type TIKUUpdateRequest = {
    code?: string;
    name?: string;
    description?: string;
    isDirectInput?: boolean;
    unit?: string;
}

export type TGetIKUParams = {
    page?: number;
    limit?: number;
    per_page?: number;
    sort?: string;
    order?: string;
    search?: string;
    search_value?: string;
    id?: string;
};

export type TIKUComponentItem = {
    id: string;
    code: string;
    name: string;
    description: string;
    dataType: string;
    sourceType: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
    finalResultKey?: string
};

export type TIKUComponentCreateRequest = {
    code: string;
    name: string;
    description: string;
    componentId: string;
}

export type TIKUComponentUpdateRequest = {
    code?: string;
    name?: string;
    description?: string;
}

export type TIKUFormulaStepCreateRequest = {
    sequence: number;
    leftType: string;
    leftValue: string;
    operator: string;
    rightType: string;
    rightValue: string;
    resultKey: string;
};

export type TIKUFormulaCreateRequest = {
    ikuId?: string;
    name: string;
    description: string;
    finalResultKey: string;
    isActive: boolean;
    isFinal?: boolean;
    steps: TIKUFormulaStepCreateRequest[];
};

export type TIKUFormulaItem = {
    id: string;
    ikuId: string;
    name: string;
    description: string;
    finalResultKey: string;
    isActive: boolean;
    isFinal?: boolean;
    steps?: TIKUFormulaStepCreateRequest[];
    createdAt?: string;
    updatedAt?: string;
};

export type TIKUFormulaTestRequest = {
    componentValues: Record<string, number>;
};

export type TIKUFormulaComponentItem = {
    code: string;
};

export type TIKUFormulaComponentResponse = {
    success: boolean;
    data?: {
        formulaId: string;
        components: TIKUFormulaComponentItem[];
    };
};

export type TIKUListResponse = TResponsePaginate<TIKUItem>;
export type TIKUDetailResponse = TResponse<TIKUItem>;

// ─── Component List Response ───────────────────────────────────────────────────
export type TIKUComponentListResponse = TResponsePaginate<TIKUComponentItem>;

export type TIKUTargetItem = {
    id: string;
    ikuId: string;
    year: number;
    targetQ1: string;
    targetQ2: string;
    targetQ3: string;
    targetQ4: string;
    targetYear: string;
    createdAt?: string;
    updatedAt?: string;
    iku?: TIKUItem;
};

export type TIKUTargetCreateRequest = {
    ikuId: string;
    year: number | string;
    targetQ1: number | string;
    targetQ2: number | string;
    targetQ3: number | string;
    targetQ4: number | string;
    targetYear: number | string;
};

export type TIKUTargetListResponse = TResponse<TIKUTargetItem[]>;

export type TIKUTargetUpdateRequest = Partial<TIKUTargetCreateRequest>;

export type TIKUTargetDetailResponse = TResponse<TIKUTargetItem>;

// ─── IKU PIC (Assignments) ───────────────────────────────────────────────────

export type TIKUAssignmentItem = {
    id: string;
    ikuId: string;
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

export type TIKUPicListResponse = {
    success: boolean;
    data: {
        iku: TIKUItem & { isDirectInput: boolean; unit: string };
        assignments: TIKUAssignmentItem[];
    };
};

export type TAssignIKUPicRequest = {
    userIds: string[];
};