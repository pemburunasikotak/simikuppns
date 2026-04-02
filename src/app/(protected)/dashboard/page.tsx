import { FC, ReactElement } from "react";
import { Page } from "@/app/_components/ui";
import { Card, Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { GridColDef } from "@mui/x-data-grid";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { formatDateTimeWIB } from "@/utils/date";
import { useFilter } from "@/app/_hooks/use-filter";
import { TGetIKUResultParams, TIKUResultItem } from "@/api/iku-result/type";
import useGetListIKUResult from "./_hooks/use-get-list-iku-result";

const Component: FC = (): ReactElement => {
  const { filters, setFilter } = useFilter<TGetIKUResultParams>();

  const ikuResultQuery = useGetListIKUResult({
    order: "DESC",
    limit: 10,
    page: filters.page || 1,
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const series = [
    { label: "Grafik Batang", data: [4, 1, 2, 3, 5, 6, 2, 4, 3, 5, 1, 6], color: "#D1FADF" },
  ];

  const currentPage = ikuResultQuery.data?.result?.currentPage || 1;

  const columns: GridColDef<TIKUResultItem>[] = [
    {
      field: "_no",
      headerName: "No",
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const index = (ikuResultQuery.data?.result?.data ?? []).findIndex(
          (row) => row.idResult === params.row.idResult,
        );
        return (currentPage - 1) * 10 + index + 1;
      },
    },
    {
      field: "ikuName",
      headerName: "Nama IKU",
      minWidth: 200,
      flex: 1,
      valueGetter: (_value, row) => row.iku?.name ?? row.idIku,
    },
    {
      field: "periodName",
      headerName: "Periode",
      minWidth: 160,
      flex: 0.5,
      valueGetter: (_value, row) => row.period?.periodName ?? row.idPeriod,
    },
    {
      field: "calculatedValue",
      headerName: "Nilai",
      width: 120,
    },
    {
      field: "formulaVersion",
      headerName: "Versi Formula",
      width: 130,
    },
    {
      field: "calculatedAt",
      headerName: "Dihitung Pada",
      minWidth: 160,
      flex: 0.5,
      valueFormatter: (value: string) => formatDateTimeWIB(value),
    },
  ];

  return (
    <Page>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <Card style={{ padding: 10 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Grafik Batang</Typography>
            <BarChart
              xAxis={[{ data: months, scaleType: "band" }]}
              series={series}
              height={300}
              barLabel="value"
              borderRadius={4}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <Card style={{ padding: 10 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Chart PIE</Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "Chatering", color: "#6BCB77" },
                    { id: 1, value: 15, label: "Perlengkapan", color: "#4D96FF" },
                    { id: 2, value: 20, label: "Foto & Video", color: "#A66DD4" },
                    { id: 3, value: 25, label: "WO", color: "#FFD93D" },
                    { id: 4, value: 30, label: "Rias", color: "#FF6B57" },
                  ],
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 4,
                  cornerRadius: 8,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={400}
              height={330}
            />
          </Card>
        </Grid>

        {/* Tabel IKU Result */}
        <Grid size={{ xs: 12 }}>
          <Card style={{ padding: 16 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Hasil Kalkulasi IKU
            </Typography>
            <DataTable
              loading={ikuResultQuery.isLoading}
              rows={ikuResultQuery.data?.result?.data || []}
              columns={columns}
              getRowId={(row) => row.idResult}
              paginationInfo={createPaginationInfo({
                per_page: 10,
                total: ikuResultQuery.data?.result?.total || 0,
                page: ikuResultQuery.data?.result?.currentPage || 1,
              })}
              handleChange={setFilter}
            />
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Component;
