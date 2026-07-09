export type TProkerEvidence = {
  id: string;
  activityId: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
};

export type TProkerEvidenceResponse = {
  isSuccess: boolean;
  message: string;
  data: TProkerEvidence[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};
