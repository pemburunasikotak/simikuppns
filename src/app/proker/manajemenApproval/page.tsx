import { useState, useMemo } from "react";
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
  CircularProgress,
  Stack,
  Grid,
  Autocomplete,
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

import { useGetInfiniteIkuProker } from "../manajemenProgram/_hooks/use-get-list-iku-proker";
import { useGetInfiniteUser } from "./_hooks/use-get-list-user";
import { TAuthUserItem } from "@/api/user/type";

const LEVEL_OPTIONS = [
  { value: "INDICATOR_VERIFICATION", label: "Verifikasi Indikator" },
  { value: "BUDGET_VERIFICATION", label: "Verifikasi Anggaran" },
  // { value: "SUBMITTED", label: "Submitted" },
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

  const [userSearchInput, setUserSearchInput] = useState("");
  const [ikuSearchInput, setIkuSearchInput] = useState("");

  const roleKey =
    formData.level === "INDICATOR_VERIFICATION"
      ? "reviewer_indikator_proker"
      : formData.level === "BUDGET_VERIFICATION"
        ? "reviewer_anggaran_proker"
        : undefined;

  const usersInfiniteQuery = useGetInfiniteUser({
    ...(roleKey ? { roleKey } : {}),
    ...(userSearchInput.trim() ? { search: userSearchInput.trim(), search_value: userSearchInput.trim() } : {}),
  });

  const ikuInfiniteQuery = useGetInfiniteIkuProker({
    ...(ikuSearchInput.trim() ? { search: ikuSearchInput.trim(), search_value: ikuSearchInput.trim() } : {}),
  });

  const userItems: TAuthUserItem[] = useMemo(() => {
    if (!usersInfiniteQuery.data?.pages) return [];
    return usersInfiniteQuery.data.pages.flatMap((page) => {
      const rawData = (page as Record<string, unknown>)?.data;
      if (Array.isArray(rawData)) return rawData as TAuthUserItem[];
      if (rawData && typeof rawData === "object" && "items" in rawData && Array.isArray((rawData as { items: unknown[] }).items)) {
        return (rawData as { items: TAuthUserItem[] }).items;
      }
      return [];
    });
  }, [usersInfiniteQuery.data]);

  type TIkuItem = { id: string; code?: string; name?: string };
  const ikuItems: TIkuItem[] = useMemo(() => {
    if (!ikuInfiniteQuery.data?.pages) return [];
    return ikuInfiniteQuery.data.pages.flatMap((page) => {
      const rawData = (page as Record<string, unknown>)?.data;
      if (Array.isArray(rawData)) return rawData as TIkuItem[];
      if (rawData && typeof rawData === "object" && "items" in rawData && Array.isArray((rawData as { items: unknown[] }).items)) {
        return (rawData as { items: TIkuItem[] }).items;
      }
      return [];
    });
  }, [ikuInfiniteQuery.data]);

  const createMutation = useCreateApprovalReviewer();
  const updateMutation = useUpdateApprovalReviewer();
  const deleteMutation = useDeleteApprovalReviewer();

  const handleOpenAdd = () => {
    setSelectedReviewer(null);
    setUserSearchInput("");
    setIkuSearchInput("");
    setFormData({
      userId: "",
      level: "INDICATOR_VERIFICATION",
      ikuIds: [],
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (reviewer: TApprovalReviewerItem) => {
    setSelectedReviewer(reviewer);
    setUserSearchInput("");
    setIkuSearchInput("");
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
    if (formData.level === "INDICATOR_VERIFICATION" && formData.ikuIds.length === 0) {
      enqueueSnackbar("Minimal pilih 1 IKU untuk Verifikasi Indikator", { variant: "error" });
      return;
    }

    const payload = {
      ...formData,
      ikuIds: formData.ikuIds,
    };

    if (selectedReviewer) {
      updateMutation.mutate(
        {
          id: selectedReviewer.id,
          payload,
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
      createMutation.mutate(payload, {
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
          labelSearch={"User ID / IKU / Level..."}
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
          <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Stack spacing={2.5}>
              {/* Level Approval */}
              <TextField
                required
                select
                label="Level Approval"
                value={formData.level}
                onChange={(e) => {
                  const newLevel = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    level: newLevel,
                    userId: prev.level !== newLevel ? "" : prev.userId,
                  }));
                }}
                fullWidth
                variant="outlined"
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: { maxHeight: 300 },
                    },
                  },
                }}
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* User Selection (Searchable Autocomplete with Infinite Scroll) */}
              <Autocomplete
                fullWidth
                options={userItems}
                filterOptions={(options) => options}
                getOptionLabel={(opt) =>
                  typeof opt === "string"
                    ? opt
                    : `${opt.name || opt.id}${opt.email || opt.nip ? ` (${opt.email || opt.nip})` : ""}`
                }
                isOptionEqualToValue={(option, val) => Boolean(option && val && option.id === val.id)}
                value={
                  userItems.find((u) => u.id === formData.userId) ||
                  (selectedReviewer?.user && selectedReviewer.userId === formData.userId
                    ? ({
                      id: selectedReviewer.userId,
                      name: selectedReviewer.user.name || selectedReviewer.userId,
                      email: selectedReviewer.user.email,
                    } as TAuthUserItem)
                    : null)
                }
                onChange={(_, val) => setFormData((prev) => ({ ...prev, userId: val?.id || "" }))}
                onInputChange={(_, val, reason) => {
                  if (reason === "input") {
                    setUserSearchInput(val);
                  } else if (reason === "clear") {
                    setUserSearchInput("");
                  }
                }}
                loading={usersInfiniteQuery.isLoading || usersInfiniteQuery.isFetchingNextPage}
                ListboxProps={{
                  onScroll: (event: React.SyntheticEvent) => {
                    const listboxNode = event.currentTarget as HTMLElement;
                    if (listboxNode) {
                      const { scrollTop, clientHeight, scrollHeight } = listboxNode;
                      if (scrollHeight - scrollTop - clientHeight <= 80) {
                        if (usersInfiniteQuery.hasNextPage && !usersInfiniteQuery.isFetchingNextPage) {
                          usersInfiniteQuery.fetchNextPage();
                        }
                      }
                    }
                  },
                  style: { maxHeight: 250, overflow: "auto" },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={!formData.userId}
                    label="User Reviewer"
                    placeholder="user (nama, email, NIP)..."
                    helperText={
                      usersInfiniteQuery.hasNextPage
                        ? `Memuat ${userItems.length} user (Scroll kebawah untuk memuat lagi)`
                        : `Total ${userItems.length} user`
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {usersInfiniteQuery.isFetchingNextPage || usersInfiniteQuery.isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              {/* Manual User ID if user list is empty or needed */}
              {userItems.length === 0 && !usersInfiniteQuery.isLoading && (
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

              {/* IKU Selection (Searchable Autocomplete Multi-Select with Infinite Scroll) */}
              {formData.level === "INDICATOR_VERIFICATION" && (
                <Autocomplete
                  multiple
                  fullWidth
                  options={ikuItems}
                  filterOptions={(options) => options}
                  getOptionLabel={(opt) =>
                    typeof opt === "string"
                      ? opt
                      : `${opt.code ? `${opt.code} - ` : ""}${opt.name || opt.id}`
                  }
                  isOptionEqualToValue={(option, val) => Boolean(option && val && option.id === val.id)}
                  value={ikuItems.filter((i) => formData.ikuIds.includes(i.id))}
                  onChange={(_, selectedOptions) => {
                    setFormData((prev) => ({
                      ...prev,
                      ikuIds: selectedOptions.map((opt) => (typeof opt === "string" ? opt : opt.id)),
                    }));
                  }}
                  onInputChange={(_, val, reason) => {
                    if (reason === "input") {
                      setIkuSearchInput(val);
                    } else if (reason === "clear") {
                      setIkuSearchInput("");
                    }
                  }}
                  loading={ikuInfiniteQuery.isLoading || ikuInfiniteQuery.isFetchingNextPage}
                  ListboxProps={{
                    onScroll: (event: React.SyntheticEvent) => {
                      const listboxNode = event.currentTarget as HTMLElement;
                      if (listboxNode) {
                        const { scrollTop, clientHeight, scrollHeight } = listboxNode;
                        if (scrollHeight - scrollTop - clientHeight <= 80) {
                          if (ikuInfiniteQuery.hasNextPage && !ikuInfiniteQuery.isFetchingNextPage) {
                            ikuInfiniteQuery.fetchNextPage();
                          }
                        }
                      }
                    },
                    style: { maxHeight: 250, overflow: "auto" },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required={formData.level === "INDICATOR_VERIFICATION" && formData.ikuIds.length === 0}
                      label="Pilih IKU (Dapat lebih dari 1)"
                      placeholder="Cari & pilih IKU..."
                      helperText={
                        ikuInfiniteQuery.hasNextPage
                          ? `Memuat ${ikuItems.length} IKU (Scroll kebawah untuk memuat lagi)`
                          : `Total ${ikuItems.length} IKU`
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {ikuInfiniteQuery.isFetchingNextPage || ikuInfiniteQuery.isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          key={key || option.id}
                          size="small"
                          label={option.code ? `${option.code} - ${option.name}` : option.name || option.id}
                          {...tagProps}
                        />
                      );
                    })
                  }
                />
              )}
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
          <Stack spacing={1.5}>
            <Typography variant="body2">
              Apakah Anda yakin ingin menghapus approval reviewer berikut?
            </Typography>

            {selectedReviewer && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {selectedReviewer.user?.name ||
                    userItems.find((u) => u.id === selectedReviewer.userId)?.name ||
                    "User Reviewer"}
                </Typography>

                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      User ID
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 8 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ wordBreak: "break-all" }}>
                      {selectedReviewer.userId}
                    </Typography>
                  </Grid>

                  {(selectedReviewer.user?.email ||
                    userItems.find((u) => u.id === selectedReviewer.userId)?.email) && (
                    <>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography variant="caption" fontWeight={500}>
                          {selectedReviewer.user?.email ||
                            userItems.find((u) => u.id === selectedReviewer.userId)?.email}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {((selectedReviewer.user as Record<string, unknown>)?.nip ||
                    userItems.find((u) => u.id === selectedReviewer.userId)?.nip) && (
                    <>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          NIP
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography variant="caption" fontWeight={500}>
                          {String((selectedReviewer.user as Record<string, unknown>)?.nip ||
                            userItems.find((u) => u.id === selectedReviewer.userId)?.nip)}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  {selectedReviewer.level && (
                    <>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          Level
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 8 }}>
                        <Typography variant="caption" fontWeight={500}>
                          {LEVEL_OPTIONS.find((l) => l.value === selectedReviewer.level)?.label ||
                            selectedReviewer.level}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            )}
          </Stack>
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
