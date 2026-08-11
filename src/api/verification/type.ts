export interface TVerifiedBy {
  userId: string;
  userName: string;
  note: string;
  verifiedAt: string;
}

export interface TVerificationRealization {
  entityType: string;
  entityId: string;
  month: number;
  monthName: string;
  year: number;
  hasRealization: boolean;
  verificationStatus: string;
  verificationCount: number;
  verifiedBy: TVerifiedBy[];
}

export interface TVerificationComponent {
  metricType: string;
  metricId: string;
  metricCode: string;
  metricName: string;
  realizations: TVerificationRealization[];
}

export interface TVerificationMetric {
  metricType: string;
  metricId: string;
  metricCode: string;
  metricName: string;
  realizations: TVerificationRealization[];
  components?: TVerificationComponent[];
}

export interface TVerificationSummary {
  totalRecords: number;
  totalWithRealization: number;
  totalVerified: number;
  totalUnverified: number;
  totalNoRealization: number;
}

export interface TVerificationDashboardData {
  year: number;
  summary: TVerificationSummary;
  data: TVerificationMetric[];
}

export interface TVerificationDashboardResponse {
  success: boolean;
  data: TVerificationDashboardData;
}

export interface TGetVerificationDashboardParams {
  year?: number;
}

export interface TVerifyRealizationRequest {
  entityId: string;
  note?: string;
}

export interface TVerifyRealizationResponse {
  success?: boolean;
  message?: string;
  status?: boolean;
  data?: unknown;
}
