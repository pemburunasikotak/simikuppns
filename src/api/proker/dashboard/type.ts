export type TProgramByUnit = {
  unitId: string;
  count: number;
};

export type TProgramByStatus = {
  status: string;
  count: number;
};

export type TProkerDashboardResponse = {
  totalPrograms: number;
  runningPrograms: number;
  completedPrograms: number;
  delayedPrograms: number;
  masterBudget: {
    budget: number;
    realization: number;
    year: number;
  };
  totalBudget: number;
  completionPercentage: number;
  programsByUnit: TProgramByUnit[];
  programsByStatus: TProgramByStatus[];
};
