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
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
  ArrowBackOutlined,
  AnalyticsOutlined,
  TagOutlined,
  CalendarTodayOutlined,
  InfoOutlined,
  TrendingUpOutlined,
  AddOutlined,
} from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import { TMetricTag, TMetricYearData, TMetricRealization } from "@/api/master/metrics/type";
import useGetMetricDetail from "../../../_hooks/use-get-metric-detail";

const MetricDetailPage: FC = (): ReactElement => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetMetricDetail(type || "", id || "");
  const { enqueueSnackbar } = useSnackbar();

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
              <Button
                variant="contained"
                size="small"
                startIcon={<AddOutlined />}
                onClick={() => enqueueSnackbar("Fitur Tambah Realisasi akan segera hadir!", { variant: "info" })}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                  px: 2,
                }}
              >
                Tambah Realisasi
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TAHUN</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TARGET TAHUNAN</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TARGET TRIWULAN (Q1-Q4)</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>TOTAL REALISASI</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#64748b" }}>CAPAIAN (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yearsData.length > 0 ? (
                  yearsData.map((yearData: TMetricYearData) => {
                    const totalRealization = yearData.realizations?.reduce((acc: number, curr: TMetricRealization) => acc + (Number(curr.value) || 0), 0) || 0;
                    const targetYear = Number(yearData.target?.targetYear) || 0;
                    const achievement = targetYear > 0 ? (totalRealization / targetYear) * 100 : 0;

                    return (
                      <TableRow key={yearData.year} sx={{ "&:hover": { backgroundColor: "#fdfdfd" } }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
                          {yearData.year}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{targetYear || "-"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <QuarterBadge label="Q1" value={yearData.target?.targetQ1} />
                            <QuarterBadge label="Q2" value={yearData.target?.targetQ2} />
                            <QuarterBadge label="Q3" value={yearData.target?.targetQ3} />
                            <QuarterBadge label="Q4" value={yearData.target?.targetQ4} />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#6366f1" }}>
                            {totalRealization}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${achievement.toFixed(1)}%`}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: achievement >= 100 ? alpha("#22c55e", 0.1) : alpha("#6366f1", 0.1),
                              color: achievement >= 100 ? "#22c55e" : "#6366f1",
                              borderRadius: "6px",
                            }}
                          />
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
    </Page>
  );
};

const QuarterBadge = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: "45px",
      p: 0.5,
      borderRadius: "6px",
      backgroundColor: "#fff",
      border: "1px solid #f1f5f9",
    }}
  >
    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.6rem" }}>{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>{value || 0}</Typography>
  </Box>
);

const Divider = ({ sx, opacity }: { sx?: SxProps<Theme>; opacity?: number }) => (
  <Box sx={{ height: "1px", backgroundColor: "rgba(0,0,0,0.1)", opacity, ...sx }} />
);

export default MetricDetailPage;
