import { FC, ReactElement, useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";
import { TGetUnitsParams, TUnitItem } from "@/api/unit/type";
import useGetListUnit from "./_hooks/use-get-list-unit";
import useCreateUnit from "./_hooks/use-create-unit";
import useUpdateUnit from "./_hooks/use-update-unit";
import { paths } from "@/commons/constants/paths";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error) return err.message;
  return fallback;
};
const unitSchema = z.object({
  name: z.string().min(1, "Nama unit wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

type TUnitForm = z.infer<typeof unitSchema>;
const UnitPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<TGetUnitsParams>();
  // const modal = useModal();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<TUnitItem | null>(null);
  const query = useGetListUnit({
    limit: filters.limit ? Number(filters.limit) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: (filters.search as string) || (filters.search as string),
  });
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();

  // ─── Forms ────────────────────────────────────────────────────────────────
  const createForm = useForm<TUnitForm>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: "", description: "" },
  });

  const editForm = useForm<TUnitForm>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: "", description: "" },
  });

  // Sync edit form when unit is selected
  useEffect(() => {
    if (selectedUnit && isEditOpen) {
      editForm.reset({
        name: selectedUnit.name,
        description: selectedUnit.description,
      });
    }
  }, [selectedUnit, isEditOpen, editForm]);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreate = async (data: TUnitForm) => {
    try {
      await createMutation.mutateAsync(data);
      enqueueSnackbar("Unit berhasil ditambahkan", { variant: "success" });
      setIsCreateOpen(false);
      createForm.reset();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menambahkan unit"), { variant: "error" });
    }
  };

  const handleEdit = async (data: TUnitForm) => {
    if (!selectedUnit) return;
    try {
      await updateMutation.mutateAsync({ id: selectedUnit.id, body: data });
      enqueueSnackbar("Unit berhasil diperbarui", { variant: "success" });
      setIsEditOpen(false);
      setSelectedUnit(null);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal memperbarui unit"), { variant: "error" });
    }
  };

  // ─── Columns ──────────────────────────────────────────────────────────────
  const columns: GridColDef<TUnitItem>[] = [
    {
      field: "name",
      headerName: "Nama Unit",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Deskripsi",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {params.row.description || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Tanggal Dibuat",
      width: 180,
      renderCell: (params) =>
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {dayjs(params.row.createdAt).format("DD MMM YYYY HH:mm")}
          </Typography>
        </Box>
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "detail",
              type: "detail",
              onClick: () =>
                navigate(generatePath(paths.unit.detail, { id: params.row.id })),
            },
            {
              key: "edit",
              type: "edit",
              onClick: () => {
                setSelectedUnit(params.row);
                setIsEditOpen(true);
              },
            },
            // {
            //   key: "delete",
            //   type: "delete",
            //   onClick: () => {
            //     modal.confirm({
            //       icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
            //       description: `Apakah kamu akan menghapus unit "${params.row.name}"?`,
            //       onOk: () => {
            //         // deleteUnit handled via API directly if needed
            //       },
            //     });
            //   },
            // },
          ]}
        />
      ),
    },
  ];

  return (
    <Page
      breadcrumbs={[
        { label: "Manajemen Unit", path: null },
        { label: "Unit", path: null },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari unit..."}
          defaultValue={{
            search_value: filters.search
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setIsCreateOpen(true)}
            >
              Tambah Unit
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={query.data?.data || []}
        columns={columns}
        getRowHeight={() => "auto"}
        paginationInfo={createPaginationInfo({
          per_page: filters.page ? Number(filters.page) : 10,
          total: query.data?.pagination?.total || 0,
          page: query.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />

      {/* ─── Dialog Tambah Unit ──────────────────────────────────────────── */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Tambah Unit Baru</DialogTitle>
        <Divider />
        <form onSubmit={createForm.handleSubmit(handleCreate)}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Controller
                name="name"
                control={createForm.control}
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
                control={createForm.control}
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
              onClick={() => {
                setIsCreateOpen(false);
                createForm.reset();
              }}
              sx={{ fontWeight: 700, color: "text.secondary" }}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={createMutation.isPending}
              sx={{ fontWeight: 700, px: 3 }}
            >
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
              loading={updateMutation.isPending}
              sx={{ fontWeight: 700, px: 3 }}
            >
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Page>
  );
};

export default UnitPage;
