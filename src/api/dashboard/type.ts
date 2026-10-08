import { TFilterParams } from "@/commons/types/filter";
import { TResponse, TResponsePaginate } from "@/commons/types/response";


export type TTransactionFilter = TFilterParams;

export type TTransactionItem = {
  id: string;
  name: string;
  no_whatapps?: string;
  package?: string;
  event_date: string;
  total: string;
  updated_at: string;
};

export type TTransactionPaginateResponse = TResponsePaginate<TTransactionItem>;
export type TTransactionDetailResponse = TResponse<TTransactionItem>;

// ─── Dashboard IKU ───────────────────────────────────────────────────────────

export type TDashboardIKUChartDataItem = {
  period: string;
  target: number | null;
  realization: number | null;
};

export type TDashboardIKUTableDataItem = {
  period: string;
  realization: string;
  files?: {
    name: string;
    url: string;
  }[];
};

export type TDashboardIKUItem = {
  ikuId: string;
  ikuCode: string;
  ikuName: string;
  type?: string;
  chartData: TDashboardIKUChartDataItem[];
  tableData: TDashboardIKUTableDataItem[];
};

export type TDashboardIKUResponse = TResponse<TDashboardIKUItem[]>;

export type TDashboardSummaryItem = {
  period: string;
  achieved: number;
  notAchieved: number;
};

export type TDashboardSummaryResponse = {
  success: boolean;
  data: TDashboardSummaryItem[];
};

export type TProdiStep = {
  sequence: number;
  expression: string;
  result: number;
};

export type TProdiComponentValue = {
  code: string;
  source: string;
  value: number | string;
};

export type TProdiDetail = {
  prodiId: string;
  name: string;
  code: string;
  level: string;
  status: string;
  calculatedValue: number;
  target?: number;
  steps?: TProdiStep[];
  componentValues?: TProdiComponentValue[];
};

export type TFormulaDetail = {
  formulaId: string;
  formulaName: string;
  prodiLevel: string;
  result: number;
  prodis: TProdiDetail[];
};

export type TDashboardIKUDetailData = {
  iku: {
    code: string;
    name: string;
    type: string;
    unit: string;
  };
  period: {
    label: string;
    year: number;
    calculatedAt: string;
    evaluatedAt: string;
    formulaVersion: string;
  };
  summary: {
    calculatedValue: number;
    status: string;
    target: number;
  };
  formulas: TFormulaDetail[];
};

export type TDashboardIKUDetailResponse = TResponse<TDashboardIKUDetailData>;
