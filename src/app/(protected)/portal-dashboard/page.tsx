import { FC, ReactElement, useState } from "react";
import { Page } from "@/app/_components/ui";
import { Card, Grid, Typography, Box, TextField } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { GridColDef } from "@mui/x-data-grid";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { formatDateTimeWIB } from "@/utils/date";
import { useFilter } from "@/app/_hooks/use-filter";
import { TGetIKUResultParams, TIKUResultItem } from "@/api/iku-result/type";
import { TDashboardIKUItem, TDashboardIKUChartDataItem } from "@/api/dashboard/type";
import useGetListIKUResult from "../dashboard/_hooks/use-get-list-iku-result";
import useGetDashboardIKU from "../dashboard/_hooks/use-get-dashboard-iku";

const PortalDashboard: FC = (): ReactElement => {
  const { filters, setFilter } = useFilter<TGetIKUResultParams>();
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const dashboardIKUQuery = useGetDashboardIKU({ year });

  const ikuResultQuery = useGetListIKUResult({
    order: "DESC",
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
  });

  const periods = ["Q1", "Q2", "Q3", "Q4", "Year"];

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Dashboard Portal Aplikasi</Typography>
        <TextField
          label="Filter Tahun"
          type="number"
          size="small"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ width: 150, backgroundColor: 'background.paper' }}
        />
      </Box>

      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        {dashboardIKUQuery.data?.result?.map((iku: TDashboardIKUItem, index: number) => {
          const chartData = iku.chartData || [];
          const series = [
            {
              label: "Target",
              data: periods.map((p) => chartData.find((d: TDashboardIKUChartDataItem) => d.period === p)?.target || 0),
              color: "#D1FADF",
            },
            {
              label: "Realisasi",
              data: periods.map((p) => chartData.find((d: TDashboardIKUChartDataItem) => d.period === p)?.realization || 0),
              color: "#4D96FF",
            },
          ];

          return (
            <Grid key={iku.ikuId || index} size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
              <Card style={{ padding: 10, height: "100%" }}>
                <Typography variant="h6" sx={{ marginBottom: 2, fontSize: '1.1rem' }}>
                  {iku.ikuCode} - {iku.ikuName}
                </Typography>
                <BarChart
                  loading={dashboardIKUQuery.isLoading}
                  xAxis={[{ data: periods, scaleType: "band" }]}
                  series={series}
                  height={300}
                  barLabel="value"
                  borderRadius={4}
                />
              </Card>
            </Grid>
          );
        })}

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
                per_page: filters.per_page ? Number(filters.per_page) : 10,
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

export default PortalDashboard;
