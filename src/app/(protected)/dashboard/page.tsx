import { FC, ReactElement, useState } from "react";
import { Page } from "@/app/_components/ui";
import { Card, Grid, Typography, Box, Link } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { formatDateTimeWIB } from "@/utils/date";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useFilter } from "@/app/_hooks/use-filter";
import { TGetIKUResultParams, TIKUResultItem } from "@/api/iku-result/type";
import { TDashboardIKUItem, TDashboardIKUChartDataItem, TDashboardIKUTableDataItem } from "@/api/dashboard/type";
import useGetListIKUResult from "./_hooks/use-get-list-iku-result";
import useGetDashboardIKU from "./_hooks/use-get-dashboard-iku";
import useGetDashboardSummary from "./_hooks/use-get-dashboard-summary";

function PieCenterLabel({ achieved, total }: { achieved: number; total: number }) {
  const { width, height, left, top } = useDrawingArea();
  const percentage = total > 0 ? ((achieved / total) * 100).toFixed(1) : "0.0";
  return (
    <>
      <text
        x={left + width / 2}
        y={top + height / 2 - 8}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '24px', fontWeight: 500, fill: '#1f2937', fontFamily: 'sans-serif' }}
      >
        {percentage}%
      </text>
      <text
        x={left + width / 2}
        y={top + height / 2 + 18}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '14px', fill: '#6b7280', fontFamily: 'sans-serif' }}
      >
        {achieved} dari {total}
      </text>
    </>
  );
}

const Component: FC = (): ReactElement => {
  const { filters, setFilter } = useFilter<TGetIKUResultParams>();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const dashboardIKUQuery = useGetDashboardIKU({ year });
  const dashboardSummaryQuery = useGetDashboardSummary({ year, type: filters.type as string });
  const ikuResultQuery = useGetListIKUResult({
    order: "DESC",
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
  });
  const periods = ["Q1", "Q2", "Q3", "Q4", "Year"];
  const currentPage = ikuResultQuery.data?.result?.currentPage || 1;
  const tableColumns: GridColDef<TDashboardIKUTableDataItem>[] = [
    {
      field: "period",
      headerName: "Periode",
      width: 100,
    },
    {
      field: "realization",
      headerName: "Realisasi",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "files",
      headerName: "Bukti Dukung",
      minWidth: 200,
      flex: 1,
      cellClassName: "wrap-cell",
      renderCell: (params) => {
        const files = params.row.files || [];
        if (files.length === 0) return "-";
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "flex-start", py: 0.5 }}>
            {files.map((file, fIdx) => {
              const fileUrl = file.url.startsWith("http") ? file.url : `https://sim.ntech.web.id${file.url}`;
              return (
                <Link
                  key={fIdx}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#dbeafe",
                    }
                  }}
                >
                  {file.name}
                </Link>
              );
            })}
          </Box>
        );
      }
    }
  ];

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
      field: "narrative",
      headerName: "Narasi",
      minWidth: 150,
      flex: 0.8,
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

  const dataDashboardIkuRaw = dashboardIKUQuery.data?.result || [];

  const dataDashboardIkuUtama = dataDashboardIkuRaw.filter((item: TDashboardIKUItem) => item.type === "IKU_UTAMA" || item.ikuCode?.startsWith("IKU_UTAMA"));
  const dataDashboardIkuSpekta = dataDashboardIkuRaw.filter((item: TDashboardIKUItem) => item.type === "IKU_SPEKTA" || item.ikuCode?.startsWith("IKU_SPEKTA"));

  const dataDashboardIkuChartUtama = dataDashboardIkuUtama.filter((item: TDashboardIKUItem) => item.chartData?.length > 0);
  const dataDashboardIkuTableUtama = dataDashboardIkuUtama.filter((item: TDashboardIKUItem) => item.tableData?.length > 0);

  const dataDashboardIkuChartSpekta = dataDashboardIkuSpekta.filter((item: TDashboardIKUItem) => item.chartData?.length > 0);
  const dataDashboardIkuTableSpekta = dataDashboardIkuSpekta.filter((item: TDashboardIKUItem) => item.tableData?.length > 0);

  const rawIkuResultData = ikuResultQuery.data?.result?.data || [];
  const ikuResultUtama = rawIkuResultData.filter((item) => item.iku?.type === "IKU_UTAMA" || item.iku?.code?.startsWith("IKU_UTAMA"));
  const ikuResultSpekta = rawIkuResultData.filter((item) => item.iku?.type === "IKU_SPEKTA" || item.iku?.code?.startsWith("IKU_SPEKTA"));

  return (
    <Page>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Dashboard IKU</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* <FormControl size="small" sx={{ minWidth: 150, backgroundColor: 'background.paper' }}>
            <InputLabel id="filter-type-label">Tipe IKU</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filters.type || ""}
              label="Tipe IKU"
              onChange={(e) => setFilter({ type: e.target.value as string })}
            >
              <MenuItem value="">SEMUA</MenuItem>
              <MenuItem value="IKU_UTAMA">UTAMA</MenuItem>
              <MenuItem value="IKU_SPEKTA">SPEKTA</MenuItem>
            </Select>
          </FormControl> */}
          <DatePicker
            label="Filter Tahun"
            views={['year']}
            value={dayjs().year(year)}
            onChange={(newValue) => {
              if (newValue) setYear(newValue.year());
            }}
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: 150, backgroundColor: 'background.paper' }
              }
            }}
          />
        </Box>
      </Box>

      {/* Summary Section */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        {dashboardSummaryQuery.data?.data?.map((summary, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>{summary.period}</Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: summary.achieved, label: 'Tercapai', color: '#22c55e' }, // Vibrant Green
                      { id: 1, value: summary.notAchieved, label: 'Tidak Tercapai', color: '#ef4444' }, // Vibrant Red
                    ],
                    innerRadius: 65,
                    outerRadius: 85,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  }
                ]}
                width={280}
                height={230}
                margin={{ right: 5, left: 5, top: 5, bottom: 50 }}
                slotProps={{
                  legend: {
                    direction: 'horizontal',
                    position: { vertical: 'bottom', horizontal: 'center' },
                  }
                }}
              >
                <PieCenterLabel achieved={summary.achieved} total={summary.achieved + summary.notAchieved} />
              </PieChart>
            </Card>
          </Grid>
        ))}
        {/* {dashboardSummaryQuery.data?.data && dashboardSummaryQuery.data.data.length > 0 && (() => {
          const total = dashboardSummaryQuery.data.data.reduce(
            (acc, curr) => {
              if (curr.period.startsWith('Q')) {
                acc.achieved += curr.achieved;
                acc.notAchieved += curr.notAchieved;
              }
              return acc;
            },
            { achieved: 0, notAchieved: 0 }
          );

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>Total (Q1 - Q4)</Typography>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: total.achieved, label: 'Tercapai', color: '#22c55e' },
                        { id: 1, value: total.notAchieved, label: 'Tidak Tercapai', color: '#ef4444' },
                      ],
                      innerRadius: 65,
                      outerRadius: 85,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    }
                  ]}
                  width={280}
                  height={230}
                  margin={{ right: 5, left: 5, top: 5, bottom: 50 }}
                  slotProps={{
                    legend: {
                      direction: 'horizontal',
                      position: { vertical: 'bottom', horizontal: 'center' },
                    }
                  }}
                >
                  <PieCenterLabel achieved={total.achieved} total={total.achieved + total.notAchieved} />
                </PieChart>
              </Card>
            </Grid>
          );
        })()} */}
      </Grid>

      <Grid container spacing={2} sx={{ marginBottom: 2, mt: 2 }}>
        {(!filters.type || filters.type === 'IKU_UTAMA') && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                GRUP BY TYPE IKU UTAMA
              </Typography>
            </Grid>
            {dataDashboardIkuChartUtama.map((iku: TDashboardIKUItem, index: number) => {
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
                <Grid key={`utama-chart-${iku.ikuId || index}`} size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
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
            {dataDashboardIkuTableUtama.map((iku: TDashboardIKUItem, index: number) => {
              const tableData = iku.tableData || [];

              return (
                <Grid key={`utama-table-${iku.ikuId || index}`} size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                  <Card style={{ padding: 10, height: "100%" }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, fontSize: '1.1rem' }}>
                      {iku.ikuCode} - {iku.ikuName}
                    </Typography>
                    <DataTable
                      loading={dashboardIKUQuery.isLoading}
                      rows={tableData}
                      columns={tableColumns}
                      getRowId={(row) => row.period}
                      getRowHeight={() => 'auto'}
                      hidePagination
                      sx={{
                        '& .MuiDataGrid-cell': {
                          alignItems: 'flex-start',
                          py: 1,
                        },
                        '& .wrap-cell': {
                          whiteSpace: 'normal',
                          lineHeight: 'normal',
                        },
                      }}
                    />
                  </Card>
                </Grid>
              );
            })}
          </>
        )}

        {(!filters.type || filters.type === 'IKU_SPEKTA') && (
          <>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                GRUP BY TYPE IKU SPEKTA
              </Typography>
            </Grid>
            {dataDashboardIkuChartSpekta.map((iku: TDashboardIKUItem, index: number) => {
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
                <Grid key={`spekta-chart-${iku.ikuId || index}`} size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
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
            {dataDashboardIkuTableSpekta.map((iku: TDashboardIKUItem, index: number) => {
              const tableData = iku.tableData || [];

              return (
                <Grid key={`spekta-table-${iku.ikuId || index}`} size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                  <Card style={{ padding: 10, height: "100%" }}>
                    <Typography variant="h6" sx={{ marginBottom: 2, fontSize: '1.1rem' }}>
                      {iku.ikuCode} - {iku.ikuName}
                    </Typography>
                    <DataTable
                      loading={dashboardIKUQuery.isLoading}
                      rows={tableData}
                      columns={tableColumns}
                      getRowId={(row) => row.period}
                      getRowHeight={() => 'auto'}
                      hidePagination
                      sx={{
                        '& .MuiDataGrid-cell': {
                          alignItems: 'flex-start',
                          py: 1,
                        },
                        '& .wrap-cell': {
                          whiteSpace: 'normal',
                          lineHeight: 'normal',
                        },
                      }}
                    />
                  </Card>
                </Grid>
              );
            })}
          </>
        )}

        {/* Tabel IKU Result Utama */}
        {(!filters.type || filters.type === 'IKU_UTAMA') && (
          <Grid size={{ xs: 12 }}>
            <Card style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Hasil Kalkulasi IKU UTAMA
                </Typography>
              </div>
              <DataTable
                loading={ikuResultQuery.isLoading}
                rows={ikuResultUtama}
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
        )}

        {/* Tabel IKU Result Spekta */}
        {(!filters.type || filters.type === 'IKU_SPEKTA') && (
          <Grid size={{ xs: 12 }}>
            <Card style={{ padding: 16, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Hasil Kalkulasi IKU SPEKTA
                </Typography>
              </div>
              <DataTable
                loading={ikuResultQuery.isLoading}
                rows={ikuResultSpekta}
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
        )}
      </Grid>
    </Page>
  );
};

export default Component;
