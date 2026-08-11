import { FC, ReactElement, useState } from "react";
import { Page } from "@/app/_components/ui";
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  List,
  CircularProgress,
  InputAdornment,
  TextField,
  Paper,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  VerifiedOutlined,
  HourglassEmptyOutlined,
  CancelOutlined,
  AssignmentOutlined,
  TrendingUpOutlined,
  Search,
  FactCheckOutlined,
  PersonOutlined,
  EventOutlined,
  NotesOutlined,
  Close,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { formatDateTimeWIB } from "@/utils/date";
import useGetVerificationDashboard from "./_hooks/use-get-verification-dashboard";
import {
  TVerificationMetric,
  TVerificationComponent,
  TVerificationRealization,
  TVerifiedBy,
} from "@/api/verification/type";

// Helper component to render status badge
const VerificationStatusChip: FC<{
  realization: TVerificationRealization;
  onClick: () => void;
}> = ({ realization, onClick }) => {
  const { hasRealization, verificationStatus, monthName } = realization;

  let label = `${monthName}: `;
  let color: "success" | "warning" | "default" | "error" = "default";
  let variant: "filled" | "outlined" = "filled";

  if (!hasRealization) {
    label += "Tanpa Realisasi";
    color = "default";
    variant = "outlined";
  } else if (
    verificationStatus === "TERVERIFIKASI" ||
    verificationStatus === "VERIFIED"
  ) {
    label += "Terverifikasi";
    color = "success";
  } else {
    label += "Belum Verifikasi";
    color = "warning";
  }

  return (
    <Tooltip title="Klik untuk melihat rincian verifikasi" arrow>
      <Chip
        label={label}
        color={color}
        variant={variant}
        size="small"
        onClick={onClick}
        sx={{
          fontWeight: 600,
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: 1,
          },
        }}
      />
    </Tooltip>
  );
};

const VerifikatorPage: FC = (): ReactElement => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRealization, setSelectedRealization] = useState<{
    metricName: string;
    realization: TVerificationRealization;
  } | null>(null);

  const { data, isLoading, isError } = useGetVerificationDashboard({ year });

  const dashboardData = data?.data;
  const summary = dashboardData?.summary;
  const metrics = dashboardData?.data || [];

  // Filter metrics based on search query
  const filteredMetrics = metrics.filter((metric) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchMetric =
      metric.metricCode.toLowerCase().includes(query) ||
      metric.metricName.toLowerCase().includes(query);
    const matchComponent = (metric.components || []).some(
      (comp) =>
        comp.metricCode.toLowerCase().includes(query) ||
        comp.metricName.toLowerCase().includes(query)
    );
    return matchMetric || matchComponent;
  });

  return (
    <Page>
      {/* Top Header & Year Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <FactCheckOutlined color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Dashboard Verifikator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pantau dan tinjau status verifikasi realisasi IKU dan Komponen (IKP)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DatePicker
            label="Filter Tahun"
            views={["year"]}
            value={dayjs().year(year)}
            onChange={(newValue) => {
              if (newValue) setYear(newValue.year());
            }}
            slotProps={{
              textField: {
                size: "small",
                sx: { width: 160, backgroundColor: "background.paper" },
              },
            }}
          />
        </Box>
      </Box>

      {/* Summary KPI Cards Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#f8fafc",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AssignmentOutlined color="action" fontSize="small" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TOTAL REKAP
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {isLoading ? "-" : summary?.totalRecords ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "info.light",
              bgcolor: "#f0f9ff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <TrendingUpOutlined color="info" fontSize="small" />
              <Typography variant="caption" color="info.main" fontWeight={600}>
                ADA REALISASI
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {isLoading ? "-" : summary?.totalWithRealization ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "success.light",
              bgcolor: "#f0fdf4",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <VerifiedOutlined color="success" fontSize="small" />
              <Typography variant="caption" color="success.main" fontWeight={600}>
                TERVERIFIKASI
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {isLoading ? "-" : summary?.totalVerified ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "warning.light",
              bgcolor: "#fffbeb",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <HourglassEmptyOutlined color="warning" fontSize="small" />
              <Typography variant="caption" color="warning.main" fontWeight={600}>
                BELUM VERIFIKASI
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {isLoading ? "-" : summary?.totalUnverified ?? 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.300",
              bgcolor: "#f8fafc",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CancelOutlined color="disabled" fontSize="small" />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TANPA REALISASI
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" color="text.secondary">
              {isLoading ? "-" : summary?.totalNoRealization ?? 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content Card */}
      <Card sx={{ p: 2, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Status Verifikasi Per Indikator & Komponen ({year})
          </Typography>

          <TextField
            size="small"
            placeholder="Cari kode atau nama indikator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 300 } }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
            <Typography variant="body1">
              Gagal memuat data verifikasi dashboard.
            </Typography>
          </Box>
        ) : filteredMetrics.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
            <Typography variant="body1">
              {searchQuery
                ? "Tidak ada indikator yang cocok dengan pencarian."
                : "Tidak ada data verifikasi untuk tahun ini."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredMetrics.map((metric: TVerificationMetric) => (
              <Accordion
                key={metric.metricId}
                defaultExpanded
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "8px !important",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: "#f8fafc",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                      width: "100%",
                      pr: 2,
                    }}
                  >
                    <Chip
                      label={metric.metricCode}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Typography variant="subtitle1" fontWeight={700}>
                      {metric.metricName}
                    </Typography>

                    <Box sx={{ ml: "auto", display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                      {(metric.realizations || []).map((rz, rIdx) => (
                        <VerificationStatusChip
                          key={rIdx}
                          realization={rz}
                          onClick={() =>
                            setSelectedRealization({
                              metricName: `${metric.metricCode} - ${metric.metricName}`,
                              realization: rz,
                            })
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 2 }}>
                  {metric.components && metric.components.length > 0 ? (
                    <Box>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ display: "block", mb: 1, textTransform: "uppercase" }}
                      >
                        Komponen IKP ({metric.components.length})
                      </Typography>
                      <Stack spacing={1.5}>
                        {metric.components.map((comp: TVerificationComponent) => (
                          <Paper
                            key={comp.metricId}
                            elevation={0}
                            sx={{
                              p: 1.5,
                              border: "1px dashed",
                              borderColor: "grey.300",
                              borderRadius: 1.5,
                              bgcolor: "#ffffff",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={comp.metricCode}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{ fontWeight: 600 }}
                              />
                              <Typography variant="body2" fontWeight={600}>
                                {comp.metricName}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                              {(comp.realizations || []).map((crz, cIdx) => (
                                <VerificationStatusChip
                                  key={cIdx}
                                  realization={crz}
                                  onClick={() =>
                                    setSelectedRealization({
                                      metricName: `${comp.metricCode} - ${comp.metricName}`,
                                      realization: crz,
                                    })
                                  }
                                />
                              ))}
                            </Box>
                          </Paper>
                        ))}
                      </Stack>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Tidak ada rincian komponen (IKP) untuk indikator ini.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Card>

      {/* Verification Detail Dialog */}
      <Dialog
        open={Boolean(selectedRealization)}
        onClose={() => setSelectedRealization(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VerifiedOutlined color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Rincian Verifikasi
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedRealization(null)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 2.5 }}>
          {selectedRealization && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Indikator / Komponen
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {selectedRealization.metricName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 4 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Bulan & Tahun
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRealization.realization.monthName}{" "}
                    {selectedRealization.realization.year}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Status Verifikasi
                  </Typography>
                  <Chip
                    label={
                      selectedRealization.realization.verificationStatus ||
                      (selectedRealization.realization.hasRealization
                        ? "BELUM_TERVERIFIKASI"
                        : "TANPA REALISASI")
                    }
                    color={
                      selectedRealization.realization.verificationStatus ===
                        "TERVERIFIKASI" ||
                      selectedRealization.realization.verificationStatus === "VERIFIED"
                        ? "success"
                        : selectedRealization.realization.hasRealization
                        ? "warning"
                        : "default"
                    }
                    size="small"
                    sx={{ fontWeight: "bold", mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Jumlah Verifikasi
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {selectedRealization.realization.verificationCount ?? 0}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Riwayat Verifikator
                </Typography>

                {!selectedRealization.realization.verifiedBy ||
                selectedRealization.realization.verifiedBy.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                    Belum ada riwayat verifikasi untuk realisasi ini.
                  </Typography>
                ) : (
                  <List disablePadding>
                    {selectedRealization.realization.verifiedBy.map(
                      (v: TVerifiedBy, idx: number) => (
                        <Paper
                          key={idx}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: "#f8fafc",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1.5,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <PersonOutlined fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={700}>
                              {v.userName || "Verifikator"}
                            </Typography>
                          </Box>

                          {v.note && (
                            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, my: 0.5 }}>
                              <NotesOutlined fontSize="small" color="action" sx={{ mt: 0.2 }} />
                              <Typography variant="body2" color="text.secondary">
                                Catatan: {v.note}
                              </Typography>
                            </Box>
                          )}

                          {v.verifiedAt && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                              <EventOutlined fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Waktu: {formatDateTimeWIB(v.verifiedAt)}
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      )
                    )}
                  </List>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedRealization(null)} variant="outlined">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default VerifikatorPage;
