"use client";

import { FC, ReactElement } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
  Skeleton,
  SxProps,
  Theme,
} from "@mui/material";
// import { useSnackbar } from "notistack";
import {
  ArrowBackOutlined,
  AnalyticsOutlined,
  TagOutlined,
  CalendarTodayOutlined,
  InfoOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import { TMetricTag, TMetricYearData } from "@/api/master/metrics/type";
import useGetMetricDetail from "../../../_hooks/use-get-metric-detail";
import useUpdateComponentRealization from "../../../_hooks/use-update-component-realization";
import RealizationDialog from "./_components/RealizationDialog";
import { useState } from "react";

const MetricDetailPage: FC = (): ReactElement => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetMetricDetail(type || "", id || "");
  const updateMutation = useUpdateComponentRealization();

  const [selectedYearData, setSelectedYearData] = useState<TMetricYearData | null>(null);
  const [selectedRealizationId, setSelectedRealizationId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (yearData: TMetricYearData) => {
    setSelectedYearData(yearData);
    setSelectedRealizationId(yearData.realizations?.[0]?.id);
    setSelectedMonth(null);
    setIsDialogOpen(true);
  };

  const handleRowClickMonth = (id: string | null, yearData: TMetricYearData, month: number) => {
    setSelectedRealizationId(id);
    setSelectedYearData(yearData);
    setSelectedMonth(month);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Page>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "16px" }} />
        </Stack>
      </Page>
    );
  }

  const metric = data?.result?.metric;
  const yearsData = data?.result?.data || [];
  return (
    <Page
      topPage={
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ backgroundColor: "white" }}>
            <ArrowBackOutlined />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Detail {metric?.type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Melihat informasi detail dan tabel realisasi
            </Typography>
          </Box>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Metric Info Section */}
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card
            sx={{
              borderRadius: "16px",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              background: "#fff",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        label={metric?.code}
                        sx={{
                          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                          color: "white",
                          fontWeight: 700,
                          borderRadius: "8px",
                          px: 1,
                        }}
                      />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        {metric?.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.6 }}>
                      {metric?.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {metric?.tags?.map((tag: TMetricTag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          icon={<TagOutlined sx={{ fontSize: "14px !important" }} />}
                          sx={{
                            backgroundColor: alpha(tag.color || "#6366f1", 0.1),
                            color: tag.color || "#6366f1",
                            fontWeight: 600,
                            borderRadius: "6px",
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={2}>
                    <Box sx={{ p: 2, borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AnalyticsOutlined color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">Tipe</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.type}</Typography>
                      </Stack>
                      <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarTodayOutlined color="warning" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">Periode</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.periodType}</Typography>
                      </Stack>
                      <Divider sx={{ my: 1.5, opacity: 0.5 }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <InfoOutlined color="info" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">Satuan</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{metric?.unit || "-"}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Realization Table Section */}
        <Grid size={{ xs: 12 }}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TrendingUpOutlined color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Data Realisasi & Target
                </Typography>
              </Stack>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TAHUN</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>
                    {metric?.periodType?.toLowerCase() === "bulanan" || metric?.periodType?.toLowerCase() === "monthly" ? "REALISASI BULANAN" : "REALISASI TAHUNAN"}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearsData.length > 0 ? (
                  yearsData.map((yearData: TMetricYearData) => {
                    // const totalRealization = yearData.realizations?.reduce((acc: number, curr: TMetricRealization) => acc + (Number(curr.value) || 0), 0) || 0;
                    // const targetYear = Number(yearData.target?.targetYear) || 0;
                    // const achievement = targetYear > 0 ? (totalRealization / targetYear) * 100 : 0;
                    const isMonthly = metric?.periodType?.toLowerCase() === "bulanan" || metric?.periodType?.toLowerCase() === "monthly";

                    return (
                      <TableRow
                        key={yearData.year}

                        sx={{
                          "&:hover": { backgroundColor: "#f8fafc", cursor: "pointer" },
                          transition: "background-color 0.2s"
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
                          {yearData.year}
                        </TableCell>

                        <TableCell onClick={() => !isMonthly && handleRowClick(yearData)}>
                          {isMonthly ? (
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", py: 1 }}>
                              {Array.from({ length: 12 }, (_, i) => {
                                const monthNum = i + 1;
                                const realization = yearData.realizations.find(r => r.month === monthNum);
                                const id = realization?.id || null;
                                const val = realization ? Number(realization.value) : 0;
                                return (
                                  <Box
                                    key={monthNum}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowClickMonth(id, yearData, monthNum);
                                    }}
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: 48,
                                      height: 48,
                                      borderRadius: "10px",
                                      backgroundColor: val > 0 ? alpha("#6366f1", 0.1) : "#f8fafc",
                                      border: "1px solid",
                                      borderColor: val > 0 ? alpha("#6366f1", 0.3) : "#e2e8f0",
                                      cursor: "pointer",
                                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                      "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                                        borderColor: "#6366f1",
                                        backgroundColor: alpha("#6366f1", 0.15),
                                      },
                                      "&:active": {
                                        transform: "translateY(0)",
                                      }
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: "0.7rem",
                                        color: val > 0 ? "#6366f1" : "#94a3b8",
                                        fontWeight: 700,
                                        lineHeight: 1
                                      }}
                                    >
                                      {monthNum}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.9rem",
                                        fontWeight: 800,
                                        color: val > 0 ? "#1e1b4b" : "#cbd5e1",
                                        mt: 0.2
                                      }}
                                    >
                                      {val}
                                    </Typography>
                                  </Box>
                                );
                              })}
                            </Stack>
                          ) : (
                            <Stack>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {yearData.realizations.map(item => item.value).join(', ') || "-"}
                              </Typography>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">Belum ada data realisasi untuk komponen ini.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <RealizationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        yearData={selectedYearData}
        idComponent={selectedRealizationId || id || ""}
        updateRealization={updateMutation}
        metricType={metric?.periodType || ""}
        selectedMonth={selectedMonth}
        dataType={metric?.dataType || "document"}
        type={metric?.type}
        unit={metric?.unit}
      />
    </Page>
  );
};

const Divider = ({ sx, opacity }: { sx?: SxProps<Theme>; opacity?: number }) => (
  <Box sx={{ height: "1px", backgroundColor: "rgba(0,0,0,0.1)", opacity, ...sx }} />
);

export default MetricDetailPage;
