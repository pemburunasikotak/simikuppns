import { FC, ReactElement } from "react";
import { useParams } from "react-router";
import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import useGetProgram from "../../_hooks/use-get-program";
import useGetListProgramIndicator from "../_hooks/use-get-list-program-indicator";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";

import DataTable from "@/app/_components/ui/data-table";

const IndicatorTab: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const { data: programData } = useGetProgram(id as string);
  const program = programData?.data;

  console.log('CEK CEK', program)

  const { data: indicatorsResponse, isLoading } = useGetListProgramIndicator(id as string);
  const items = indicatorsResponse?.data || [];

  const columns: GridColDef<TDefaultProgramIndicator>[] = [
    { field: "name", headerName: "Nama Indikator", minWidth: 250, flex: 1 },
    { field: "unit_measurement", headerName: "Satuan", width: 150 },
    { field: "targetQ1", headerName: "Target Q1", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ2", headerName: "Target Q2", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ3", headerName: "Target Q3", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "targetQ4", headerName: "Target Q4", width: 100, align: "center", headerAlign: "center", renderCell: (params) => params.value ?? 0 },
    { field: "order", headerName: "Urutan", width: 100, align: "center", headerAlign: "center" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2, border: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="body2" color="textSecondary" fontWeight="medium" gutterBottom>
          {program?.code} • {program?.year}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {program?.title}
        </Typography>
        {program?.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {program.description}
          </Typography>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Daftar Indikator Program</Typography>

      </Box>
      <DataTable
        loading={isLoading}
        rows={items}
        columns={columns}
        checkboxSelection={false}
      />
    </Box>
  );
};

export default IndicatorTab;
