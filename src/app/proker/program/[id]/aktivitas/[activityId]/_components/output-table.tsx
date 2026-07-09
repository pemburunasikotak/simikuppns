import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, IconButton } from "@mui/material";
import { Add, DeleteOutlined, Close } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";

import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import { createPaginationInfo } from "@/utils/data-table";
import FormTextField from "@/app/_components/ui/form-text-field";

import { useGetOutputs, useCreateOutput, useUpdateOutput, useDeleteOutput } from "../_hooks/output/use-output";
import { TProkerOutput, TProkerOutputPayload } from "@/api/proker/aktivitas/output/type";

interface Props {
  activityId: string;
}

const OutputTable = ({ activityId }: Props) => {
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TProkerOutput | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const modal = useModal();

  const { data, isLoading } = useGetOutputs(activityId, {
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value,
  });

  const createMutation = useCreateOutput(activityId);
  const updateMutation = useUpdateOutput(activityId);
  const deleteMutation = useDeleteOutput(activityId);

  const form = useForm<TProkerOutputPayload>({
    defaultValues: {
      metricType: "",
      target: 0,
      realization: 0,
      unit: "",
      description: "",
    },
  });

  const items = data?.data || [];
  const pagination = data?.pagination;

  const handleAdd = () => {
    setEditItem(null);
    form.reset({
      metricType: "",
      target: 0,
      realization: 0,
      unit: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: TProkerOutput) => {
    setEditItem(item);
    form.reset({
      metricType: item.metricType,
      target: item.target,
      realization: item.realization,
      unit: item.unit,
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const onSubmit = (formData: TProkerOutputPayload) => {
    // Convert target/realization to numbers if they are parsed as strings
    const payload = {
      ...formData,
      target: Number(formData.target),
      realization: Number(formData.realization),
    };

    if (editItem) {
      updateMutation.mutate(
        { id: editItem.id, payload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil mengubah output", { variant: "success" });
            setIsModalOpen(false);
          },
          onError: () => enqueueSnackbar("Gagal mengubah output", { variant: "error" }),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          enqueueSnackbar("Berhasil menambahkan output", { variant: "success" });
          setIsModalOpen(false);
        },
        onError: () => enqueueSnackbar("Gagal menambahkan output", { variant: "error" }),
      });
    }
  };

  const columns: GridColDef<TProkerOutput>[] = [
    { field: "metricType", headerName: "Tipe Metrik", minWidth: 150, flex: 1 },
    { field: "target", headerName: "Target", minWidth: 100 },
    { field: "realization", headerName: "Realisasi", minWidth: 100 },
    { field: "unit", headerName: "Satuan", minWidth: 100 },
    { field: "description", headerName: "Deskripsi", minWidth: 200, flex: 1 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => handleEdit(params.row),
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Output",
                description: "Apakah anda yakin ingin menghapus output ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteMutation.mutate(params.row.id, {
                    onSuccess: () => enqueueSnackbar("Berhasil menghapus output", { variant: "success" }),
                    onError: () => enqueueSnackbar("Gagal menghapus output", { variant: "error" }),
                  });
                },
              });
            },
          },
        ];
        return <ActionButtonTable items={actionItems} />;
      },
    },
  ];

  return (
    <>
      <Filter
        variants={["search"]}
        labelSearch={"Cari Output..."}
        defaultValue={{ search_value: filter.search || filter.search_value }}
        actions={[
          <Button key="add" variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Tambah Output
          </Button>,
        ]}
      />
      <DataTable
        loading={isLoading || deleteMutation.isPending}
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
          {editItem ? "Edit Output" : "Tambah Output"}
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
                  label="Tipe Metrik"
                  control={form.control}
                  name="metricType"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  variant="filled"
                  label="Target"
                  control={form.control}
                  name="target"
                  type="number"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  variant="filled"
                  label="Realisasi"
                  control={form.control}
                  name="realization"
                  type="number"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  variant="filled"
                  label="Satuan (Unit)"
                  control={form.control}
                  name="unit"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  variant="filled"
                  label="Deskripsi"
                  control={form.control}
                  name="description"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="outlined">Batal</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending || updateMutation.isPending}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default OutputTable;
