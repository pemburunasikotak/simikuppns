import prokerAxiosInstance from "@/libs/axios/proker-config";
import {
  TUnitBudgetProposal,
  TUnitBudgetProposalResponse,
  TSaveUnitBudgetProposalPayload,
} from "./type";

export const getUnitBudgetProposals = async (
  params?: Record<string, unknown>
): Promise<TUnitBudgetProposalResponse> => {
  const { data } = await prokerAxiosInstance.get("/api/v1/unit-budget-proposals", { params });
  return data;
};

export const getMyUnitBudgetProposals = async (
  params?: Record<string, unknown>
): Promise<TUnitBudgetProposalResponse> => {
  const queryParams: Record<string, unknown> = {};
  if (params?.year) {
    queryParams.year = params.year;
  }
  const { data } = await prokerAxiosInstance.get("/api/v1/unit-budget-proposals/my-units", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });

  let rawList: unknown[] = [];
  if (data && Array.isArray(data.data)) {
    rawList = data.data;
  } else if (data && Array.isArray(data)) {
    rawList = data;
  } else if (data?.data && Array.isArray(data.data.items)) {
    rawList = data.data.items;
  }

  const items: TUnitBudgetProposal[] = rawList.map((item: unknown) => {
    const obj = (item || {}) as Record<string, unknown>;
    if ("proposal" in obj || "unit" in obj) {
      const prop = (obj.proposal || {}) as Record<string, unknown>;
      const unitObj = (obj.unit || prop.unit || {}) as { id?: string; name?: string };
      const unitId = (prop.unitId || unitObj.id || obj.unitId || "") as string;
      const year = (prop.year || obj.year || new Date().getFullYear()) as number;

      return {
        ...prop,
        id: (prop.id || "") as string,
        unitId,
        year,
        unit: unitObj,
        perbaikanValue: (prop.perbaikanValue || 0) as number,
        bahanHabisValue: (prop.bahanHabisValue || 0) as number,
        peralatanValue: (prop.peralatanValue || 0) as number,
        pelatihanValue: (prop.pelatihanValue || 0) as number,
        meubelairValue: (prop.meubelairValue || 0) as number,
        totalValue: (prop.totalValue || 0) as number,
      } as TUnitBudgetProposal;
    }
    return item as TUnitBudgetProposal;
  });

  return {
    isSuccess: data?.isSuccess ?? true,
    message: data?.message ?? "Success",
    data: {
      items,
      pagination: {
        page: 1,
        limit: items.length || 10,
        totalItems: items.length,
        totalPages: 1,
      },
    },
  };
};

export const getUnitBudgetProposalByUnitAndYear = async (
  unitId: string,
  year: number | string
): Promise<{ isSuccess: boolean; message: string; data: TUnitBudgetProposal }> => {
  const { data } = await prokerAxiosInstance.get(`/api/v1/unit-budget-proposals/${unitId}/${year}`);
  return data;
};

export const saveUnitBudgetProposal = async (
  unitId: string,
  year: number | string,
  payload: TSaveUnitBudgetProposalPayload
): Promise<{ isSuccess: boolean; message: string; data: TUnitBudgetProposal }> => {
  const { data } = await prokerAxiosInstance.put(`/api/v1/unit-budget-proposals/${unitId}/${year}`, payload);
  return data;
};

export const deleteUnitBudgetProposal = async (
  unitId: string,
  year: number | string
): Promise<{ isSuccess: boolean; message: string }> => {
  const { data } = await prokerAxiosInstance.delete(`/api/v1/unit-budget-proposals/${unitId}/${year}`);
  return data;
};
