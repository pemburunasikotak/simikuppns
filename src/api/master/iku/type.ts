import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";

export type TIKUFilter = TFilterParams;

export type TIKUItem = {
    id: string;
    code: string;
    name: string;
    description: string;
    createdAt?: string | null;
    updatedAt?: string | null;
    deletedAt?: string | null;
};

export type TIKUCreateRequest = {
    code: string;
    name: string;
    description: string;
}

export type TIKUUpdateRequest = {
    code?: string;
    name?: string;
    description?: string;
}

export type TGetIKUParams = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
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
    ikuId: string;
    name: string;
    description: string;
    finalResultKey: string;
    isActive: boolean;
    steps: TIKUFormulaStepCreateRequest[];
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