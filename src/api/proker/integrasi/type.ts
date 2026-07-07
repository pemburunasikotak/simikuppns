export type TIntegrationProgram = {
  id: string;
  programName: string;
  source: string;
  status: string;
  lastSync?: string;
  details?: string;
};

export type TIntegrationResponse = {
  data: TIntegrationProgram[];
  total?: number;
};
