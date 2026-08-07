import { FC, ReactElement, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  LockOutlined,
  LockOpenOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import useModal from "@/app/_components/ui/modal";
import useGetPeriodLocks from "./_hooks/use-get-period-locks";
import useUpdatePeriodLock from "./_hooks/use-update-period-lock";
import useUpdateBulkPeriodLocks from "./_hooks/use-update-bulk-period-locks";
import { TPeriodLockItem } from "@/api/settings/period-lock/type";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type LocalLockRow = {
  month: number;
  monthName: string;
  year: number;
  locked: boolean;
  allowAdminBypass: boolean;
  reason: string;
  lockedBy?: string | null;
  lockedAt?: string | null;
};

const PeriodLockPage: FC = (): ReactElement => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [items, setItems] = useState<LocalLockRow[]>([]);

  const query = useGetPeriodLocks({ year: selectedYear });
  const updateSingleMutation = useUpdatePeriodLock();
  const updateBulkMutation = useUpdateBulkPeriodLocks();

  // Initialize or update local state from query data
  useEffect(() => {
    const rawData = query.data?.result || query.data?.data || [];
    const rawMap = new Map<number, TPeriodLockItem>();
    if (Array.isArray(rawData)) {
      rawData.forEach((item) => rawMap.set(item.month, item));
    }

    const merged: LocalLockRow[] = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const existing = rawMap.get(monthNum);
      return {
        month: monthNum,
        monthName: existing?.monthName || MONTH_NAMES[i],
        year: selectedYear,
        locked: existing?.locked ?? false,
        allowAdminBypass: existing?.allowAdminBypass ?? false,
        reason: existing?.reason || "",
        lockedBy: existing?.lockedBy || null,
        lockedAt: existing?.lockedAt || null,
      };
    });

    setItems(merged);
  }, [query.data, selectedYear]);

  const handleToggleLock = (month: number) => {
    const targetItem = items.find((i) => i.month === month);
    if (!targetItem) return;
    const newLocked = !targetItem.locked;
    setItems((prev) =>
      prev.map((item) =>
        item.month === month ? { ...item, locked: newLocked } : item
      )
    );
    updateSingleMutation.mutate({
      month: targetItem.month,
      year: selectedYear,
      locked: newLocked,
      allowAdminBypass: targetItem.allowAdminBypass,
      reason: targetItem.reason,
    });
  };

  const handleToggleBypass = (month: number) => {
    const targetItem = items.find((i) => i.month === month);
    if (!targetItem) return;
    const newBypass = !targetItem.allowAdminBypass;
    setItems((prev) =>
      prev.map((item) =>
        item.month === month
          ? { ...item, allowAdminBypass: newBypass }
          : item
      )
    );
    updateSingleMutation.mutate({
      month: targetItem.month,
      year: selectedYear,
      locked: targetItem.locked,
      allowAdminBypass: newBypass,
      reason: targetItem.reason,
    });
  };

  const handleReasonChange = (month: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.month === month ? { ...item, reason: value } : item))
    );
  };

  const handleReasonBlur = (month: number) => {
    const targetItem = items.find((i) => i.month === month);
    if (!targetItem) return;
    updateSingleMutation.mutate({
      month: targetItem.month,
      year: selectedYear,
      locked: targetItem.locked,
      allowAdminBypass: targetItem.allowAdminBypass,
      reason: targetItem.reason,
    });
  };

  const modal = useModal();

  const executeBulkAction = (lockAll: boolean) => {
    const updated = items.map((item) => ({
      ...item,
      locked: lockAll,
    }));
    setItems(updated);
    updateBulkMutation.mutate({
      year: selectedYear,
      locks: updated.map((item) => ({
        month: item.month,
        locked: item.locked,
        allowAdminBypass: item.allowAdminBypass,
        reason: item.reason,
      })),
    });
  };

  const handleBulkAction = (lockAll: boolean) => {
    modal.confirm({
      icon: lockAll ? (
        <LockOutlined sx={{ height: 40, width: 40, color: "error.main" }} />
      ) : (
        <LockOpenOutlined sx={{ height: 40, width: 40, color: "success.main" }} />
      ),
      description: lockAll
        ? `Apakah Anda yakin ingin MENGUNCI semua periode bulan untuk tahun ${selectedYear}?`
        : `Apakah Anda yakin ingin MEMBUKA kunci semua periode bulan untuk tahun ${selectedYear}?`,
      onOk: () => executeBulkAction(lockAll),
    });
  };

  // Stats calculation
  const lockedCount = items.filter((i) => i.locked).length;
  const unlockedCount = items.filter((i) => !i.locked).length;
  const bypassCount = items.filter((i) => i.allowAdminBypass).length;

  return (
    <Page
      breadcrumbs={[
        { label: "Master Data", path: null },
        { label: "Setting Lock", path: null },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Top Control Header */}
        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="year-select-label">Tahun Periode</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Tahun Periode"
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {yearOptions.map((y) => (
                    <MenuItem key={y} value={y}>
                      Tahun {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
              <Stack direction="row" spacing={1.5} justifyContent={{ xs: "flex-start", sm: "flex-end" }} flexWrap="wrap" gap={1}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={updateBulkMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <LockOutlined />}
                  size="small"
                  disabled={updateBulkMutation.isPending}
                  onClick={() => handleBulkAction(true)}
                >
                  Lock Semua Bulan
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  startIcon={updateBulkMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <LockOpenOutlined />}
                  size="small"
                  disabled={updateBulkMutation.isPending}
                  onClick={() => handleBulkAction(false)}
                >
                  Unlock Semua Bulan
                </Button>
                {/* 
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={updateBulkMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
                  disabled={updateBulkMutation.isPending}
                  size="small"
                  onClick={handleSaveBulk}
                >
                  Simpan Bulk ({selectedYear})
                </Button> */}

                <IconButton
                  color="default"
                  onClick={() => query.refetch()}
                  disabled={query.isFetching}
                  size="small"
                >
                  <RefreshOutlined />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Summary Cards */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderLeft: "4px solid #1976d2", borderRadius: 2 }}>
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Total Bulan
                </Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  12 Bulan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderLeft: "4px solid #d32f2f", borderRadius: 2 }}>
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Status Terkunci
                </Typography>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  {lockedCount} Bulan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderLeft: "4px solid #2e7d32", borderRadius: 2 }}>
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Status Terbuka
                </Typography>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  {unlockedCount} Bulan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderLeft: "4px solid #ed6c02", borderRadius: 2 }}>
              <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Admin Bypass Active
                </Typography>
                <Typography variant="h5" fontWeight={700} color="warning.main">
                  {bypassCount} Bulan
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Period Lock Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table sx={{ minWidth: 700 }} aria-label="period lock table">
            <TableHead sx={{ backgroundColor: "grey.100" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Bulan</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140 }}>Nama Bulan</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 150 }}>Status Lock</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 160 }}>Admin Bypass</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Alasan / Catatan Lock</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 180 }}>Info Penguncian</TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: 700, width: 100 }}>Aksi</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Memuat data lock periode...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Tidak ada data lock periode</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow
                    key={row.month}
                    hover
                    sx={{
                      backgroundColor: row.locked ? "rgba(211, 47, 47, 0.02)" : "transparent",
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={String(row.month).padStart(2, "0")}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.monthName} {selectedYear}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Switch
                          checked={row.locked}
                          onChange={() => handleToggleLock(row.month)}
                          color="error"
                          size="small"
                        />
                        {row.locked ? (
                          <Chip
                            icon={<LockOutlined style={{ fontSize: 14 }} />}
                            label="Terkunci"
                            color="error"
                            size="small"
                            variant="filled"
                          />
                        ) : (
                          <Chip
                            icon={<LockOpenOutlined style={{ fontSize: 14 }} />}
                            label="Terbuka"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Izinkan admin melakukan input/edit meskipun periode terkunci">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Switch
                            checked={row.allowAdminBypass}
                            onChange={() => handleToggleBypass(row.month)}
                            color="warning"
                            size="small"
                          />
                          <Typography variant="caption" color={row.allowAdminBypass ? "warning.dark" : "text.secondary"}>
                            {row.allowAdminBypass ? "Izinkan" : "Tidak"}
                          </Typography>
                        </Stack>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Contoh: Deadline sudah lewat"
                        value={row.reason}
                        onChange={(e) => handleReasonChange(row.month, e.target.value)}
                        onBlur={() => handleReasonBlur(row.month)}
                        inputProps={{ style: { fontSize: "0.875rem" } }}
                      />
                    </TableCell>

                    <TableCell>
                      {row.lockedAt ? (
                        <Box>
                          <Typography variant="caption" display="block" color="text.primary" fontWeight={500}>
                            {new Date(row.lockedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                          {row.lockedBy && (
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                              ID: {row.lockedBy.slice(0, 8)}...
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          -
                        </Typography>
                      )}
                    </TableCell>

                    {/* <TableCell align="center">
                      <Tooltip title="Simpan perubahan bulan ini">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleSaveSingle(row)}
                          disabled={updateSingleMutation.isPending}
                        >
                          <SaveOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Page>
  );
};

export default PeriodLockPage;
