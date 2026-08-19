import { useState } from "react";
import dayjs from "dayjs";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Stack,
  Grid,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";

import { useGetApprovalReviewers } from "./_hooks/use-get-approval-reviewers";
import { useGetApprovalReviewerById } from "./_hooks/use-get-approval-reviewer-by-id";
import { useCreateApprovalReviewer } from "./_hooks/use-create-approval-reviewer";
import { useUpdateApprovalReviewer } from "./_hooks/use-update-approval-reviewer";
import { useDeleteApprovalReviewer } from "./_hooks/use-delete-approval-reviewer";
import { TApprovalReviewerItem } from "@/api/proker/approvalReviewer/type";

import useGetListIkuProker from "../manajemenProgram/_hooks/use-get-list-iku-proker";
import useGetListUser from "./_hooks/use-get-list-user";
import { TAuthUserItem } from "@/api/user/type";

const LEVEL_OPTIONS = [
  { value: "INDICATOR_VERIFICATION", label: "Verifikasi Indikator" },
  { value: "PROGRAM_VERIFICATION", label: "Verifikasi Program" },
  { value: "SUBMITTED", label: "Submitted" },
];

export default function ManajemenApprovalPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const queryParams = {
    ...filter,
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  };

  const reviewersQuery = useGetApprovalReviewers(queryParams);
  const ikuQuery = useGetListIkuProker();
  const usersQuery = useGetListUser({});

  const createMutation = useCreateApprovalReviewer();
  const updateMutation = useUpdateApprovalReviewer();
  const deleteMutation = useDeleteApprovalReviewer();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedReviewer, setSelectedReviewer] = useState<TApprovalReviewerItem | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const detailQuery = useGetApprovalReviewerById(detailId || undefined);

  const [formData, setFormData] = useState<{
    userId: string;
    level: string;
    ikuIds: string[];
  }>({
    userId: "",
    level: "INDICATOR_VERIFICATION",
    ikuIds: [],
  });

  const ikuItems = ikuQuery.data?.data?.items || [];
  const rawUserData = usersQuery.data?.data;
  const userItems: TAuthUserItem[] = Array.isArray(rawUserData)
    ? rawUserData
    : rawUserData && typeof rawUserData === "object" && "items" in rawUserData && Array.isArray(rawUserData.items)
      ? rawUserData.items
      : [];

  const handleOpenAdd = () => {
    setSelectedReviewer(null);
    setFormData({
      userId: "",
      level: "INDICATOR_VERIFICATION",
      ikuIds: [],
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (reviewer: TApprovalReviewerItem) => {
    setSelectedReviewer(reviewer);
    setFormData({
      userId: reviewer.userId || "",
      level: reviewer.level || "INDICATOR_VERIFICATION",
      ikuIds: reviewer.ikuId ? [reviewer.ikuId] : [],
    });
    setOpenModal(true);
  };
  void handleOpenEdit;

  const handleOpenDetail = (reviewer: TApprovalReviewerItem) => {
    setSelectedReviewer(reviewer);
    setDetailId(reviewer.id);
    setOpenDetail(true);
  };

  const handleOpenDelete = (reviewer: TApprovalReviewerItem) => {
    setSelectedReviewer(reviewer);
    setOpenDelete(true);
  };

  const handleIkuChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      ikuIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      enqueueSnackbar("User Wajib dipilih", { variant: "error" });
      return;
    }
    if (!formData.level) {
      enqueueSnackbar("Level Wajib diisi", { variant: "error" });
      return;
    }
    if (formData.ikuIds.length === 0) {
      enqueueSnackbar("Minimal pilih 1 IKU", { variant: "error" });
      return;
    }

    if (selectedReviewer) {
      updateMutation.mutate(
        {
          id: selectedReviewer.id,
          payload: formData,
        },
        {
          onSuccess: () => {
            enqueueSnackbar("Approval Reviewer berhasil diperbarui", { variant: "success" });
            setOpenModal(false);
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(
              error?.response?.data?.message || "Gagal memperbarui Approval Reviewer",
              { variant: "error" }
            );
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          enqueueSnackbar("Approval Reviewer berhasil ditambahkan", { variant: "success" });
          setOpenModal(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(
            error?.response?.data?.message || "Gagal menambahkan Approval Reviewer",
            { variant: "error" }
          );
        },
      });
    }
  };

  const handleDelete = () => {
    if (selectedReviewer) {
      deleteMutation.mutate(selectedReviewer.id, {
        onSuccess: () => {
          enqueueSnackbar("Approval Reviewer berhasil dihapus", { variant: "success" });
          setOpenDelete(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(
            error?.response?.data?.message || "Gagal menghapus Approval Reviewer",
            { variant: "error" }
          );
        },
      });
    }
  };

  // Normalize list data from API
  const rawData = reviewersQuery.data?.data;
  let rows: TApprovalReviewerItem[] = [];
  let totalItems = 0;
  let page = 1;
  let limit = 10;

  if (Array.isArray(rawData)) {
    rows = rawData;
    totalItems = rawData.length;
  } else if (rawData && typeof rawData === "object" && "items" in rawData) {
    rows = rawData.items || [];
    if (rawData.pagination) {
      totalItems = rawData.pagination.totalItems || rows.length;
      page = rawData.pagination.page || 1;
      limit = rawData.pagination.limit || 10;
    }
  }

  // Filter client-side search if needed
  const searchValue = String(filter.search || filter.search_value || "").toLowerCase();
  const filteredRows = searchValue
    ? rows.filter(
      (r) =>
        r.userId?.toLowerCase().includes(searchValue) ||
        r.user?.name?.toLowerCase().includes(searchValue) ||
        r.level?.toLowerCase().includes(searchValue) ||
        r.ikuId?.toLowerCase().includes(searchValue) ||
        r.iku?.code?.toLowerCase().includes(searchValue) ||
        r.iku?.name?.toLowerCase().includes(searchValue)
    )
    : rows;

  const columns: GridColDef<TApprovalReviewerItem>[] = [
    {
      field: "user",
      headerName: "User",
      minWidth: 240,
      flex: 1,
      renderCell: (params) => {
        const u = userItems.find((usr) => usr.id === params.row.userId);
        const name = params.row.user?.name || u?.name;
        const email = params.row.user?.email || u?.email;
        return (
          <Box sx={{ py: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {name || params.row.userId}
            </Typography>
            {email && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {email}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "level",
      headerName: "Level Approval",
      minWidth: 190,
      flex: 1,
      renderCell: (params) => {
        const levelOpt = LEVEL_OPTIONS.find((l) => l.value === params.row.level);
        const label = levelOpt ? levelOpt.label : params.row.level || "-";
        const color =
          params.row.level === "INDICATOR_VERIFICATION"
            ? "info"
            : params.row.level === "PROGRAM_VERIFICATION"
            ? "secondary"
            : "primary";
        return (
          <Box sx={{ py: 1, display: "flex", alignItems: "center" }}>
            <Chip
              label={label}
              color={color}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        );
      },
    },
    {
      field: "ikuId",
      headerName: "IKU",
      minWidth: 280,
      flex: 1.5,
      renderCell: (params) => {
        const ikuObj = ikuItems.find((i) => i.id === params.row.ikuId) || params.row.iku;
        const code = ikuObj?.code;
        const name = ikuObj?.name;
        const fullLabel = code && name ? `${code} - ${name}` : name || code || params.row.ikuId || "-";

        return (
          <Box sx={{ py: 1, display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
            {code && (
              <Chip
                label={code}
                size="small"
                variant="filled"
                color="default"
                sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}
              />
            )}
            <Typography variant="body2" noWrap title={fullLabel}>
              {name || fullLabel}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Dibuat Pada",
      minWidth: 170,
      renderCell: (params) => {
        if (!params.row.createdAt) return "-";
        return (
          <Box sx={{ py: 1, display: "flex", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {dayjs(params.row.createdAt).format("DD/MM/YYYY, HH.mm")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const items = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => handleOpenDetail(params.row),
          },
          // {
          //   key: "edit",
          //   type: "edit" as const,
          //   onClick: () => handleOpenEdit(params.row),
          // },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => handleOpenDelete(params.row),
          },
        ];
        return <ActionButtonTable items={items} />;
      },
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Manajemen Approval",
          path: "/proker/manajemenApproval",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari User ID / IKU / Level..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={handleOpenAdd}
            >
              Tambah Reviewer
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={reviewersQuery.isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : limit,
          total: totalItems,
          page: filter.page ? Number(filter.page) : page,
        })}
        handleChange={setFilter}
      />

      {/* ── Form Modal (Tambah / Edit) ── */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle fontWeight="bold">
            {selectedReviewer ? "Edit Approval Reviewer" : "Tambah Approval Reviewer"}
          </DialogTitle>
          <Divider />
          <DialogContent dividers>
            <Stack spacing={2.5}>
              {/* User Selection */}
              <TextField
                required
                select
                label="User Reviewer"
                value={formData.userId}
                onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                fullWidth
                variant="outlined"
                helperText="Pilih User yang ditugaskan sebagai reviewer approval"
              >
                {userItems.length > 0 ? (
                  userItems.map((usr) => (
                    <MenuItem key={usr.id} value={usr.id}>
                      {usr.name} ({usr.email || usr.nip || usr.id})
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    Data User tidak tersedia / masukkan User ID secara manual
                  </MenuItem>
                )}
              </TextField>

              {/* Manual User ID if user list is empty or needed */}
              {userItems.length === 0 && (
                <TextField
                  required
                  label="User ID (UUID)"
                  value={formData.userId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440001"
                />
              )}

              {/* Level Approval */}
              <TextField
                required
                select
                label="Level Approval"
                value={formData.level}
                onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                fullWidth
                variant="outlined"
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* IKU Multi-Select */}
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="iku-select-label">Pilih IKU (Dapat lebih dari 1)</InputLabel>
                <Select
                  labelId="iku-select-label"
                  multiple
                  value={formData.ikuIds}
                  onChange={handleIkuChange}
                  input={<OutlinedInput label="Pilih IKU (Dapat lebih dari 1)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => {
                        const ikuObj = ikuItems.find((i) => i.id === val);
                        return (
                          <Chip
                            key={val}
                            label={ikuObj ? `${ikuObj.code} - ${ikuObj.name}` : val}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {ikuItems.map((iku) => (
                    <MenuItem key={iku.id} value={iku.id}>
                      {iku.code} - {iku.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Detail Modal ── */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Detail Approval Reviewer</DialogTitle>
        <Divider />
        <DialogContent dividers>
          {detailQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            (() => {
              const detailData = detailQuery.data?.data || selectedReviewer;
              const detailUser = detailData?.user || userItems.find((u) => u.id === detailData?.userId);
              const detailIku = ikuItems.find((i) => i.id === detailData?.ikuId) || detailData?.iku;
              const levelOption = LEVEL_OPTIONS.find((l) => l.value === detailData?.level);
              const levelLabel = levelOption ? levelOption.label : detailData?.level || "-";
              const ikuLabel = detailIku
                ? `${detailIku.code ? `${detailIku.code} - ` : ""}${detailIku.name || ""}`.trim()
                : detailData?.ikuId || "-";

              return (
                <Stack spacing={2}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nama User
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {detailUser?.name || detailData?.userId || "-"}
                      </Typography>
                      {detailUser?.email && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {detailUser.email}
                        </Typography>
                      )}
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Level Approval
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Chip
                        label={levelLabel}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        IKU
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {ikuLabel}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Dibuat Pada
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="body2">
                        {detailData?.createdAt
                          ? new Date(detailData.createdAt).toLocaleString("id-ID")
                          : "-"}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Reviewer ID
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                        {detailData?.id || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              );
            })()
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained" color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation Modal ── */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Konfirmasi Hapus</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Typography>
            Apakah Anda yakin ingin menghapus approval reviewer untuk User ID{" "}
            <strong>{selectedReviewer?.userId}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={24} /> : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
