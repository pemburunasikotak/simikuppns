import { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import {
  CheckCircleOutlined,
  CancelOutlined,
  EditNoteOutlined,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import { useGetApprovedIndicators } from "./_hooks/use-get-approved-indicators";
import {
  useApproveAnggaranIndicator,
  useRejectAnggaranIndicator,
  useRevisionAnggaranIndicator,
} from "./_hooks/use-approval-anggaran-actions";
import { TSubmittedIndicatorItem } from "@/api/proker/approval/type";

type ActionType = "approval" | "reject" | "revision";

interface ActionDialogState {
  open: boolean;
  type: ActionType;
  item: TSubmittedIndicatorItem | null;
}

const formatRupiah = (amount?: string | number) => {
  if (!amount) return "-";
  const num = Number(amount);
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function ApprovalAnggaranPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const [note, setNote] = useState("");
  const [dialogState, setDialogState] = useState<ActionDialogState>({
    open: false,
    type: "approval",
    item: null,
  });

  const queryParams = {
    ...filter,
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  };

  const query = useGetApprovedIndicators(queryParams);
  const approveMutation = useApproveAnggaranIndicator();
  const rejectMutation = useRejectAnggaranIndicator();
  const revisionMutation = useRevisionAnggaranIndicator();

  const handleOpenDialog = (type: ActionType, item: TSubmittedIndicatorItem) => {
    setNote("");
    setDialogState({
      open: true,
      type,
      item,
    });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, type: "approval", item: null });
    setNote("");
  };

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialogState.item) return;

    const payload = { note };
    const id = dialogState.item.id;

    if (dialogState.type === "approval") {
      approveMutation.mutate(
        { id, payload },
        {
          onSuccess: (res) => {
            enqueueSnackbar(res?.message || "Indikator anggaran berhasil disetujui", {
              variant: "success",
            });
            handleCloseDialog();
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(
              error?.response?.data?.message || "Gagal menyetujui indikator anggaran",
              { variant: "error" }
            );
          },
        }
      );
    } else if (dialogState.type === "reject") {
      rejectMutation.mutate(
        { id, payload },
        {
          onSuccess: (res) => {
            enqueueSnackbar(res?.message || "Indikator anggaran berhasil ditolak", {
              variant: "success",
            });
            handleCloseDialog();
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(
              error?.response?.data?.message || "Gagal menolak indikator anggaran",
              { variant: "error" }
            );
          },
        }
      );
    } else if (dialogState.type === "revision") {
      revisionMutation.mutate(
        { id, payload },
        {
          onSuccess: (res) => {
            enqueueSnackbar(res?.message || "Permintaan revisi anggaran berhasil dikirim", {
              variant: "success",
            });
            handleCloseDialog();
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(
              error?.response?.data?.message || "Gagal mengirim permintaan revisi anggaran",
              { variant: "error" }
            );
          },
        }
      );
    }
  };

  const isSubmitting =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    revisionMutation.isPending;

  const columns: GridColDef<TSubmittedIndicatorItem>[] = [
    {
      field: "name",
      headerName: "Nama Indikator",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
          <Typography variant="body2" fontWeight={500}>
            {params.row.name || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "program",
      headerName: "Program",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const title =
          params.row.program?.title ||
          params.row.program?.name ||
          params.row.program?.code ||
          "-";
        return (
          <Box sx={{ py: 1.5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="body2" fontWeight={500} lineHeight={1.3}>
              {title}
            </Typography>
            {params.row.program?.code && (
              <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
                {params.row.program.code}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "unit",
      headerName: "Unit",
      minWidth: 240,
      flex: 1.5,
      renderCell: (params) => {
        const unitName = params.row.unit?.name || params.row.unit?.code;
        if (!unitName)
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );

        return (
          <Box sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
            <Chip
              label={unitName}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                height: "auto",
                minHeight: 28,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "6px",
                borderColor: "primary.main",
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                "& .MuiChip-label": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  px: 1,
                  py: 0.25,
                  display: "block",
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "targets",
      headerName: "Target (Q1-Q4)",
      minWidth: 180,
      renderCell: (params) => {
        const { targetQ1, targetQ2, targetQ3, targetQ4 } = params.row;
        if (!targetQ1 && !targetQ2 && !targetQ3 && !targetQ4)
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ py: 1.5, alignItems: "center" }}>
            <Chip
              label={`Q1: ${targetQ1 ?? "-"}`}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem", borderRadius: "4px" }}
            />
            <Chip
              label={`Q2: ${targetQ2 ?? "-"}`}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem", borderRadius: "4px" }}
            />
            <Chip
              label={`Q3: ${targetQ3 ?? "-"}`}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem", borderRadius: "4px" }}
            />
            <Chip
              label={`Q4: ${targetQ4 ?? "-"}`}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: "0.7rem", borderRadius: "4px" }}
            />
          </Stack>
        );
      },
    },
    {
      field: "budget",
      headerName: "Anggaran",
      minWidth: 140,
      renderCell: (params) => (
        <Box sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
          <Typography variant="body2">{formatRupiah(params.row.budget)}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      renderCell: (params) => {
        const status = params.row.status || "SUBMITTED";
        let color: "info" | "success" | "error" | "warning" | "default" = "info";
        if (status === "SUBMITTED") color = "info";
        else if (status === "APPROVED") color = "success";
        else if (status === "REJECTED") color = "error";
        else if (status === "REVISION") color = "warning";

        return (
          <Box sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
            <Chip
              label={status}
              color={color}
              size="small"
              variant="filled"
              sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, borderRadius: "6px" }}
            />
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Tanggal Pengajuan",
      minWidth: 160,
      renderCell: (params) => {
        if (!params.row.createdAt) return "-";
        const date = new Date(params.row.createdAt);
        return (
          <Box sx={{ py: 1.5, display: "flex", alignItems: "center" }}>
            <Typography variant="body2">
              {isNaN(date.getTime())
                ? params.row.createdAt
                : date.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1.5, height: "100%" }}>
            <Tooltip title="Approval (Setujui)">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleOpenDialog("approval", params.row)}
              >
                <CheckCircleOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject (Tolak)">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleOpenDialog("reject", params.row)}
              >
                <CancelOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Revision (Revisi)">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleOpenDialog("revision", params.row)}
              >
                <EditNoteOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const filteredRows = query.data?.data?.items || [];
  const totalItems = query.data?.data?.pagination?.totalItems || 0;
  const currentPage = query.data?.data?.pagination?.page || 1;
  const limit = query.data?.data?.pagination?.limit || 10;

  const dialogConfig = {
    approval: {
      title: "Approval Anggaran Indikator",
      confirmLabel: "Setujui",
      color: "success" as const,
      description: "Apakah Anda yakin ingin menyetujui anggaran indikator berikut?",
    },
    reject: {
      title: "Tolak Anggaran Indikator",
      confirmLabel: "Tolak",
      color: "error" as const,
      description: "Apakah Anda yakin ingin menolak anggaran indikator berikut?",
    },
    revision: {
      title: "Revisi Anggaran Indikator",
      confirmLabel: "Kirim Revisi",
      color: "warning" as const,
      description: "Masukkan catatan revisi untuk anggaran indikator berikut:",
    },
  }[dialogState.type];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Sim Proker",
          path: "/proker/dashboard",
        },
        {
          label: "Approval Anggaran",
          path: "/proker/approvalAnggaran",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari indikator..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={false}
        getRowHeight={() => "auto"}
        paginationInfo={createPaginationInfo({
          per_page: limit,
          total: totalItems,
          page: currentPage,
        })}
        handleChange={setFilter}
      />

      {/* ── Dialog Action (Approval, Reject, Revision) ── */}
      <Dialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmitAction}>
          <DialogTitle fontWeight="bold">{dialogConfig.title}</DialogTitle>
          <Divider />
          <DialogContent dividers>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {dialogConfig.description}
            </Typography>
            {dialogState.item && (
              <Box
                sx={{
                  p: 2.5,
                  mb: 2.5,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack spacing={1.5}>
                  {/* Title & Category */}
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                      display="block"
                      sx={{ textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}
                    >
                      Nama Indikator
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                      {dialogState.item.name}
                    </Typography>
                    {dialogState.item.category && (
                      <Chip
                        label={dialogState.item.category}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mt: 0.5, height: 20, fontSize: "0.7rem", fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Divider />

                  <Grid container spacing={2}>
                    {/* Program Details */}
                    {dialogState.item.program && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Program:
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {dialogState.item.program.title ||
                            dialogState.item.program.name ||
                            dialogState.item.program.code}
                        </Typography>
                        {dialogState.item.program.code && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Kode: {dialogState.item.program.code}
                          </Typography>
                        )}
                        {dialogState.item.program.year && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Tahun: {dialogState.item.program.year}
                          </Typography>
                        )}
                        {dialogState.item.program.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ fontStyle: "italic", mt: 0.5 }}
                          >
                            "{dialogState.item.program.description}"
                          </Typography>
                        )}
                      </Grid>
                    )}

                    {/* Unit Details */}
                    {dialogState.item.unit && (
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                          Unit:
                        </Typography>
                        <Chip
                          label={dialogState.item.unit.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            height: "auto",
                            minHeight: 28,
                            py: 0.5,
                            fontWeight: 600,
                            borderRadius: "6px",
                            "& .MuiChip-label": {
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              px: 1,
                              py: 0.25,
                              display: "block",
                            },
                          }}
                        />
                        {dialogState.item.unit.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ fontStyle: "italic", mt: 0.5 }}
                          >
                            "{dialogState.item.unit.description}"
                          </Typography>
                        )}
                      </Grid>
                    )}

                    {/* Target Pertriwulan */}
                    {(dialogState.item.targetQ1 ||
                      dialogState.item.targetQ2 ||
                      dialogState.item.targetQ3 ||
                      dialogState.item.targetQ4) && (
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Target Pertriwulan (Q1 - Q4):
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap" gap={0.5}>
                          <Chip
                            label={`Q1: ${dialogState.item.targetQ1 ?? "-"}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600 }}
                          />
                          <Chip
                            label={`Q2: ${dialogState.item.targetQ2 ?? "-"}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600 }}
                          />
                          <Chip
                            label={`Q3: ${dialogState.item.targetQ3 ?? "-"}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600 }}
                          />
                          <Chip
                            label={`Q4: ${dialogState.item.targetQ4 ?? "-"}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600 }}
                          />
                        </Stack>
                      </Grid>
                    )}

                    {/* Anggaran */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Anggaran:
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color="primary.main">
                        {formatRupiah(dialogState.item.budget)}
                      </Typography>
                    </Grid>

                    {/* Status & Tanggal Pengajuan */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status / Tanggal:
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Chip
                          label={dialogState.item.status || "SUBMITTED"}
                          color={
                            dialogState.item.status === "APPROVED"
                              ? "success"
                              : dialogState.item.status === "REJECTED"
                                ? "error"
                                : dialogState.item.status === "REVISION"
                                  ? "warning"
                                  : "info"
                          }
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600 }}
                        />
                        {dialogState.item.createdAt && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(dialogState.item.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            )}

            <TextField
              required
              margin="dense"
              name="note"
              label="Catatan (Note)"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Masukkan catatan..."
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
            <Button onClick={handleCloseDialog} color="inherit" disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={dialogConfig.color}
              disabled={isSubmitting || !note.trim()}
            >
              {dialogConfig.confirmLabel}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Page>
  );
}
