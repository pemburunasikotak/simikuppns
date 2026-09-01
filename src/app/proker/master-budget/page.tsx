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
  Stack,
  Chip,
  Box,
  LinearProgress,
  FormControl,
  FormLabel,
  FormGroup,
  InputAdornment,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import BaseInputText from "@/app/_components/ui/base-input-text";
import { useFilter } from "@/app/_hooks/use-filter";

import { useGetMasterBudgets } from "./_hooks/use-get-master-budgets";
import { useCreateMasterBudget } from "./_hooks/use-create-master-budget";
import { useUpdateMasterBudget } from "./_hooks/use-update-master-budget";
import { useDeleteMasterBudget } from "./_hooks/use-delete-master-budget";
import { TProkerMasterBudget } from "@/api/proker/masterBudget/type";

const formatRupiah = (value: string | number) => {
  const numberString = String(value).replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

const parseRupiahNumber = (value: string) => {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MasterBudgetPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { filters, setFilter } = useFilter<{
    search?: string;
    search_value?: string;
    page?: number;
    per_page?: number;
  }>();

  const queryParams = {
    ...filters,
    search: filters.search_value || filters.search,
    page: filters.page ? Number(filters.page) : 1,
    limit: filters.per_page ? Number(filters.per_page) : 10,
  };

  const query = useGetMasterBudgets(queryParams);
  const createMutation = useCreateMasterBudget();
  const updateMutation = useUpdateMasterBudget();
  const deleteMutation = useDeleteMasterBudget();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedBudget, setSelectedBudget] = useState<TProkerMasterBudget | null>(null);
  const [formData, setFormData] = useState<{
    year: string | number;
    budget: string;
    realization: string;
  }>({
    year: new Date().getFullYear(),
    budget: "",
    realization: "",
  });

  const handleOpenAdd = () => {
    setSelectedBudget(null);
    setFormData({
      year: new Date().getFullYear(),
      budget: "",
      realization: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (item: TProkerMasterBudget) => {
    setSelectedBudget(item);
    setFormData({
      year: item.year,
      budget: formatRupiah(item.budget || 0),
      realization: formatRupiah(item.realization || 0),
    });
    setOpenModal(true);
  };

  const handleOpenDelete = (item: TProkerMasterBudget) => {
    setSelectedBudget(item);
    setOpenDelete(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseRupiahNumber(formData.budget);
    const realizationNum = parseRupiahNumber(formData.realization);
    const yearNum = Number(formData.year);

    if (!yearNum || yearNum < 2000) {
      enqueueSnackbar("Masukkan tahun yang valid", { variant: "warning" });
      return;
    }

    if (selectedBudget) {
      updateMutation.mutate(
        {
          year: selectedBudget.year,
          budget: budgetNum,
          realization: realizationNum,
        },
        {
          onSuccess: () => {
            enqueueSnackbar("Master budget berhasil diperbarui", { variant: "success" });
            setOpenModal(false);
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(error?.response?.data?.message || "Gagal memperbarui master budget", { variant: "error" });
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          year: yearNum,
          budget: budgetNum,
          realization: realizationNum,
        },
        {
          onSuccess: () => {
            enqueueSnackbar("Master budget berhasil ditambahkan", { variant: "success" });
            setOpenModal(false);
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            enqueueSnackbar(error?.response?.data?.message || "Gagal menambahkan master budget", { variant: "error" });
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (selectedBudget) {
      deleteMutation.mutate(selectedBudget.year, {
        onSuccess: () => {
          enqueueSnackbar("Master budget berhasil dihapus", { variant: "success" });
          setOpenDelete(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal menghapus master budget", { variant: "error" });
        },
      });
    }
  };

  const items = query.data?.data?.items || [];
  const pagination = query.data?.data?.pagination || {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  };

  type TRow = TProkerMasterBudget & { id: number };
  const rows: TRow[] = items.map((item) => ({
    ...item,
    id: item.year,
  }));

  const columns: GridColDef<TRow>[] = [
    {
      field: "year",
      headerName: "Tahun",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            label={params.row.year}
            size="small"
            color="primary"
            sx={{ fontWeight: 700, borderRadius: "6px" }}
          />
        </Box>
      ),
    },
    {
      field: "budget",
      headerName: "Pagu Anggaran",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography variant="body2" fontWeight={600}>
            {formatCurrency(params.row.budget)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "realization",
      headerName: "Realisasi Anggaran",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Typography variant="body2" fontWeight={600} color="secondary.main">
            {formatCurrency(params.row.realization)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "percentage",
      headerName: "Capaian",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        const total = params.row.budget || 0;
        const real = params.row.realization || 0;
        const pct = total > 0 ? Math.round((real / total) * 100) : 0;
        return (
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", width: "100%", pr: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" fontWeight={700}>
                {pct}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, pct)}
              sx={{ height: 8, borderRadius: 4 }}
              color={pct >= 100 ? "success" : pct >= 50 ? "primary" : "warning"}
            />
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "edit",
              type: "edit",
              onClick: () => handleOpenEdit(params.row),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => handleOpenDelete(params.row),
            },
          ]}
        />
      ),
    },
  ];

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Page
      breadcrumbs={[
        {
          label: "Master Budget",
          path: "/proker/master-budget",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Master Budget..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
        />
      }
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Master Budget
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={handleOpenAdd}
            sx={{ fontWeight: 700, borderRadius: "8px" }}
          >
            Tambah Master Budget
          </Button>
        </Stack>

        <DataTable
          loading={query.isLoading}
          rows={rows}
          columns={columns}
          paginationInfo={createPaginationInfo({
            per_page: pagination.limit || 10,
            total: pagination.totalItems || 0,
            page: pagination.page || 1,
          })}
          handleChange={setFilter}
        />
      </Stack>

      {/* ─── Dialog Form (Tambah / Edit Master Budget) ────────────────────────── */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {selectedBudget ? "Edit Master Budget" : "Tambah Master Budget"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Tahun"
                type="number"
                value={formData.year}
                disabled={!!selectedBudget}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: e.target.value }))
                }
                required
              />

              <FormControl variant="standard" sx={{ width: "100%" }}>
                <FormLabel htmlFor="budget-total" required>
                  Pagu Anggaran
                </FormLabel>
                <FormGroup>
                  <BaseInputText
                    id="budget-total"
                    variant="outlined"
                    value={formData.budget}
                    placeholder="Contoh: 1.000.000.000"
                    onChange={(e) => {
                      const formatted = formatRupiah(e.target.value);
                      setFormData((prev) => ({ ...prev, budget: formatted }));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Rp
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </FormGroup>
              </FormControl>

              <FormControl variant="standard" sx={{ width: "100%" }}>
                <FormLabel htmlFor="budget-realization" required>
                  Realisasi Anggaran
                </FormLabel>
                <FormGroup>
                  <BaseInputText
                    id="budget-realization"
                    variant="outlined"
                    value={formData.realization}
                    placeholder="Contoh: 500.000.000"
                    onChange={(e) => {
                      const formatted = formatRupiah(e.target.value);
                      setFormData((prev) => ({ ...prev, realization: formatted }));
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" fontWeight={600} color="text.secondary">
                            Rp
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    required
                  />
                </FormGroup>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setOpenModal(false)}
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{ fontWeight: 700, px: 3 }}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Dialog Hapus Master Budget ───────────────────────────────────────── */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "error.main" }}>
          Hapus Master Budget
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus Master Budget tahun{" "}
            <strong>{selectedBudget?.year}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDelete(false)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={isPending}
            onClick={handleDelete}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
