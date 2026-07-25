import { FC, ReactElement } from "react";
import { useParams } from "react-router";
import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import useGetListProgramIndicator from "../_hooks/use-get-list-program-indicator";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";

import DataTable from "@/app/_components/ui/data-table";

const IndicatorTab: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading } = useGetListProgramIndicator(id as string);
  const items = response?.data || [];

  const columns: GridColDef<TDefaultProgramIndicator>[] = [
    { field: "name", headerName: "Nama Indikator", minWidth: 250, flex: 1 },
    { field: "unit", headerName: "Satuan", width: 150 },
    { field: "targetQ1", headerName: "Target Q1", width: 100, align: "center", headerAlign: "center" },
    { field: "targetQ2", headerName: "Target Q2", width: 100, align: "center", headerAlign: "center" },
    { field: "targetQ3", headerName: "Target Q3", width: 100, align: "center", headerAlign: "center" },
    { field: "targetQ4", headerName: "Target Q4", width: 100, align: "center", headerAlign: "center" },
    { field: "order", headerName: "Urutan", width: 100, align: "center", headerAlign: "center" },
  ];

  return (
    <Box>
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
