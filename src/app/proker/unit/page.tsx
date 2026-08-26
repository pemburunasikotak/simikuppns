import { useState } from "react";
import { useNavigate } from "react-router";
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
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { AddOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useGetProkerUnits } from "./_hooks/use-get-units";
import { useCreateProkerUnit } from "./_hooks/use-create-unit";
import { useUpdateProkerUnit } from "./_hooks/use-update-unit";
import { useDeleteProkerUnit } from "./_hooks/use-delete-unit";
import { useExportProkerByUnit } from "./_hooks/use-export-unit";
import { TProkerUnit } from "@/api/proker/unit/type";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";

export default function UnitPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });

  const queryParams = {
    ...filter,
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  };

  const query = useGetProkerUnits(queryParams);
  const { data: allUnitsData } = useGetProkerUnits({ limit: 100 });
  const createMutation = useCreateProkerUnit();
  const updateMutation = useUpdateProkerUnit();
  const deleteMutation = useDeleteProkerUnit();
  const exportMutation = useExportProkerByUnit();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedExportUnitId, setSelectedExportUnitId] = useState<string | number>("");
  const [selectedExportYear, setSelectedExportYear] = useState<number | string>(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState<TProkerUnit | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleOpenAdd = () => {
    setSelectedUnit(null);
    setFormData({ name: "", description: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (unit: TProkerUnit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      description: unit.description || "",
    });
    setOpenModal(true);
  };

  const handleOpenDelete = (unit: TProkerUnit) => {
    setSelectedUnit(unit);
    setOpenDelete(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnit) {
      updateMutation.mutate({ id: selectedUnit.id, payload: formData }, {
        onSuccess: () => {
          enqueueSnackbar("Unit berhasil diperbarui", { variant: "success" });
          setOpenModal(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal memperbarui unit", { variant: "error" });
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          enqueueSnackbar("Unit berhasil ditambahkan", { variant: "success" });
          setOpenModal(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal menambahkan unit", { variant: "error" });
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedUnit) {
      deleteMutation.mutate(selectedUnit.id, {
        onSuccess: () => {
          enqueueSnackbar("Unit berhasil dihapus", { variant: "success" });
          setOpenDelete(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal menghapus unit", { variant: "error" });
        }
      });
    }
  };

  const handleDownloadExcel = async () => {
    if (!selectedExportUnitId) {
      enqueueSnackbar("Pilih unit terlebih dahulu", { variant: "warning" });
      return;
    }
    if (!selectedExportYear) {
      enqueueSnackbar("Masukkan tahun terlebih dahulu", { variant: "warning" });
      return;
    }
    try {
      setIsExporting(true);
      const blob = await exportMutation.mutateAsync({
        unitId: selectedExportUnitId,
        year: selectedExportYear,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proker-export-${selectedExportUnitId}-${selectedExportYear}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("Berhasil mengunduh Excel Proker", { variant: "success" });
      setOpenExportModal(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      enqueueSnackbar(error?.response?.data?.message || "Gagal mengunduh Excel Proker", { variant: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const columns: GridColDef<TProkerUnit>[] = [
    { field: "name", headerName: "Nama Unit", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const items = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => navigate(`/proker/unit/${params.row.id}`),
          },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => handleOpenEdit(params.row),
          },
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

  const filteredRows = query.data?.items || [];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Manajemen Unit",
          path: "/proker/unit",
        },
        {
          label: "Unit",
          path: "/proker/unit",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Unit..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="export"
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadOutlined />}
              onClick={() => {
                if (allUnitsData?.items?.[0]?.id) {
                  setSelectedExportUnitId(allUnitsData.items[0].id);
                }
                setOpenExportModal(true);
              }}
            >
              Unduh Excel
            </Button>,
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={handleOpenAdd}
            >
              Tambah Unit
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: query.data?.pagination?.totalItems || 0,
          page: query.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle fontWeight="bold">
            {selectedUnit ? "Edit Unit" : "Tambah Unit Baru"}
          </DialogTitle>
          <Divider />
          <DialogContent dividers>
            <TextField
              required
              margin="dense"
              name="name"
              label="Nama Unit"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Deskripsi"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Button onClick={() => setOpenModal(false)} color="inherit">Batal</Button>
            <Button type="submit" variant="contained" color="primary" disabled={createMutation.isPending || updateMutation.isPending}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Konfirmasi Hapus</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Typography>
            Apakah Anda yakin ingin menghapus unit <strong>{selectedUnit?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleteMutation.isPending}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Export Excel Proker ── */}
      <Dialog open={openExportModal} onClose={() => setOpenExportModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Unduh Excel Proker</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Pilih unit dan tahun program kerja yang ingin diunduh format Excel.
            </Typography>
            <TextField
              select
              label="Unit"
              value={selectedExportUnitId}
              onChange={(e) => setSelectedExportUnitId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Pilih Unit</MenuItem>
              {(allUnitsData?.items || []).map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Tahun"
              type="number"
              value={selectedExportYear}
              onChange={(e) => setSelectedExportYear(e.target.value)}
              fullWidth
              placeholder="Contoh: 2025"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button onClick={() => setOpenExportModal(false)} color="inherit" disabled={isExporting}>
            Batal
          </Button>
          <Button
            onClick={handleDownloadExcel}
            variant="contained"
            color="primary"
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : <FileDownloadOutlined />}
          >
            {isExporting ? "Mengunduh..." : "Unduh Excel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}

