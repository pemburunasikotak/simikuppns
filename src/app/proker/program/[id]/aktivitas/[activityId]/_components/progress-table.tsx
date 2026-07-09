import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import FormTextField from "@/app/_components/ui/form-text-field";

import { useGetProgress, useCreateProgress } from "../_hooks/progress/use-progress";
import { TProkerProgress, TProkerProgressPayload } from "@/api/proker/aktivitas/progress/type";

interface Props {
  activityId: string;
}

const ProgressTable = ({ activityId }: Props) => {
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading } = useGetProgress(activityId, {
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value,
  });

  const createMutation = useCreateProgress(activityId);

  const form = useForm<TProkerProgressPayload>({
    defaultValues: {
      progress: 0,
      note: "",
    },
  });

  const items = data?.data || [];
  const pagination = data?.pagination;

  const handleAdd = () => {
    form.reset({
      progress: 0,
      note: "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = (formData: TProkerProgressPayload) => {
    const payload = {
      ...formData,
      progress: Number(formData.progress),
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan progress", { variant: "success" });
        setIsModalOpen(false);
      },
      onError: () => enqueueSnackbar("Gagal menambahkan progress", { variant: "error" }),
    });
  };

  const columns: GridColDef<TProkerProgress>[] = [
    { field: "progress", headerName: "Progress (%)", minWidth: 150, renderCell: (params) => `${params.row.progress}%` },
    { field: "note", headerName: "Catatan", minWidth: 300, flex: 1 },
    { field: "createdBy", headerName: "Dibuat Oleh", minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Waktu Input",
      minWidth: 200,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString("id-ID"),
    },
  ];

  return (
    <>
      <Filter
        variants={["search"]}
        labelSearch={"Cari Progress..."}
        defaultValue={{ search_value: filter.search || filter.search_value }}
        actions={[
          <Button key="add" variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Tambah Progress
          </Button>,
        ]}
      />
      <DataTable
        loading={isLoading || createMutation.isPending}
        rows={items}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: pagination?.limit || filter.per_page ? Number(filter.per_page) : 10,
          total: pagination?.totalItems || items.length || 0,
          page: pagination?.page || filter.page ? Number(filter.page) : 1,
        })}
        handleChange={setFilter}
      />

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Tambah Progress
          <IconButton onClick={() => setIsModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  variant="filled"
                  label="Progress (%)"
                  control={form.control}
                  name="progress"
                  type="number"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  variant="filled"
                  label="Catatan"
                  control={form.control}
                  name="note"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="outlined">Batal</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default ProgressTable;
