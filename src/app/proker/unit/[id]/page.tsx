import { FC, ReactElement, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Skeleton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { EditOutlined, DeleteOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";

import { Page } from "@/app/_components/ui";
import { paths } from "@/commons/constants/paths";

import UsersTab from "./_components/users-tab";
import IKUTab from "./_components/iku-tab";
import ProgramTab from "./_components/program-tab";
import useGetUnitDetails from "./_hooks/use-get-unit-details";
import { useUpdateProkerUnit } from "../_hooks/use-update-unit";
import { useDeleteProkerUnit } from "../_hooks/use-delete-unit";
import { useExportProkerByUnit } from "../_hooks/use-export-unit";

const unitSchema = z.object({
  name: z.string().min(1, "Nama unit wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

type TUnitForm = z.infer<typeof unitSchema>;

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

const UnitDetailPage: FC = (): ReactElement => {
  const { id: unitId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [tabValue, setTabValue] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedExportYear, setSelectedExportYear] = useState<number | string>(new Date().getFullYear());
  const [selectedExportType, setSelectedExportType] = useState<string>("USULAN");
  const [isExporting, setIsExporting] = useState(false);

  const { data: detailData, isLoading } = useGetUnitDetails(unitId || "");
  const updateMutation = useUpdateProkerUnit();
  const deleteMutation = useDeleteProkerUnit();
  const exportMutation = useExportProkerByUnit();

  const editForm = useForm<TUnitForm>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (detailData?.unit && isEditOpen) {
      editForm.reset({
        name: detailData.unit.name,
        description: detailData.unit.description || "",
      });
    }
  }, [detailData, isEditOpen, editForm]);

  if (!unitId) return <></>;

  const handleEdit = async (data: TUnitForm) => {
    try {
      await updateMutation.mutateAsync({ id: unitId, payload: data });
      enqueueSnackbar("Unit berhasil diperbarui", { variant: "success" });
      setIsEditOpen(false);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal memperbarui unit"), { variant: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(unitId);
      enqueueSnackbar("Unit berhasil dihapus", { variant: "success" });
      setIsDeleteOpen(false);
      navigate(paths.proker.unit);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menghapus unit"), { variant: "error" });
    }
  };

  const handleOpenExportModal = () => {
    setSelectedExportYear(new Date().getFullYear());
    setOpenExportModal(true);
  };

  const handleDownloadExcel = async () => {
    if (!selectedExportYear) {
      enqueueSnackbar("Masukkan tahun terlebih dahulu", { variant: "warning" });
      return;
    }
    if (!selectedExportType) {
      enqueueSnackbar("Pilih tipe terlebih dahulu", { variant: "warning" });
      return;
    }
    try {
      setIsExporting(true);
      const blob = await exportMutation.mutateAsync({
        unitId,
        year: selectedExportYear,
        type: selectedExportType,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proker-export-${unitId}-${selectedExportYear}-${selectedExportType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("Berhasil mengunduh Excel Proker", { variant: "success" });
      setOpenExportModal(false);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal mengunduh Excel Proker"), { variant: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Page
      breadcrumbs={[
        { label: "Manajemen Unit", path: paths.proker.unit },
        { label: "Detail Unit", path: null },
      ]}
    >
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
            <Box>
              {isLoading ? (
                <Skeleton variant="text" width={250} height={40} />
              ) : (
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {detailData?.unit?.name}
                </Typography>
              )}
              {isLoading ? (
                <Skeleton variant="text" width={400} height={24} />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {detailData?.unit?.description || "Tidak ada deskripsi"}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditOutlined />}
                onClick={() => setIsEditOpen(true)}
                disabled={isLoading}
              >
                Edit Unit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlined />}
                onClick={() => setIsDeleteOpen(true)}
                disabled={isLoading}
              >
                Hapus Unit
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<FileDownloadOutlined />}
                onClick={handleOpenExportModal}
                disabled={isLoading}
              >
                Unduh
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Anggota Unit" />
          <Tab label="IKU Unit" />
          <Tab label="Program" />
        </Tabs>
      </Box>

      <UsersTab unitId={unitId} value={tabValue} index={0} />
      <IKUTab unitId={unitId} value={tabValue} index={1} />
      <ProgramTab unitId={unitId} value={tabValue} index={2} />

      {/* ─── Dialog Edit Unit ────────────────────────────────────────────── */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Edit Unit</DialogTitle>
        <Divider />
        <form onSubmit={editForm.handleSubmit(handleEdit)}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Controller
                name="name"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Nama Unit"
                    placeholder="Masukkan nama unit"
                    required
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Deskripsi"
                    placeholder="Masukkan deskripsi unit"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setIsEditOpen(false)}
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isPending}
              sx={{ fontWeight: 700, px: 3 }}
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ─── Dialog Hapus Unit ────────────────────────────────────────────── */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, color: "error.main" }}>
          Hapus Unit
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Apakah kamu yakin ingin menghapus unit{" "}
            <strong>{detailData?.unit?.name}</strong>? Tindakan ini tidak dapat
            dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsDeleteOpen(false)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}
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
              Masukkan tahun program kerja yang ingin diunduh format Excel.
            </Typography>
            <TextField
              label="Tahun"
              type="number"
              value={selectedExportYear}
              onChange={(e) => setSelectedExportYear(e.target.value)}
              fullWidth
              placeholder="Contoh: 2025"
            />
            <TextField
              select
              label="Tipe"
              value={selectedExportType}
              onChange={(e) => setSelectedExportType(e.target.value)}
              fullWidth
            >
              <MenuItem value="USULAN">USULAN</MenuItem>
              <MenuItem value="FINAL">FINAL</MenuItem>
              <MenuItem value="BERITA_ACARA">BERITA ACARA</MenuItem>
            </TextField>
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
};

export default UnitDetailPage;

