import { useEffect, useState } from "react";
import { Button, Grid, Stack, Divider, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import DataTable from "@/app/_components/ui/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";

import { ComponentSchema, TComponentFormData } from "./schema";
import { createPaginationInfo } from "@/utils/data-table";
import useModal from "@/app/_components/ui/modal";

import useGetListComponentTarget from "../../[id]/_hooks/use-get-list-component-target";
import useDeleteComponentTarget from "../../[id]/_hooks/use-delete-component-target";
import ModalAddComponentTarget from "../modal-add-component-target";
import { TComponentTargetItem, TComponentAssignmentItem } from "@/api/master/component/type";
import useGetListComponentPic from "../../[id]/_hooks/use-get-list-component-pic";
import useAssignComponentPic from "../../[id]/_hooks/use-assign-component-pic";
import ModalAddPic from "../modal-add-pic";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TComponentFormData) => void;
  defaultValues?: Partial<TComponentFormData>;
}

const ComponentForm = ({ loading, handleSubmit, defaultValues, isEdit }: Props) => {
  const form = useForm<TComponentFormData>({
    resolver: zodResolver(ComponentSchema),
    mode: "onChange",
  });

  const params = useParams();
  const modal = useModal();
  const targetQuery = useGetListComponentTarget({ componentId: params.id as string });
  const deleteTarget = useDeleteComponentTarget();

  const [openAddModalTarget, setOpenAddModalTarget] = useState(false);
  const [targetModalMode, setTargetModalMode] = useState<"add" | "edit" | "detail">("add");
  const [selectedTarget, setSelectedTarget] = useState<TComponentTargetItem | null>(null);

  const picQuery = useGetListComponentPic(params.id as string);
  const assignPic = useAssignComponentPic();
  const [openAddModalPic, setOpenAddModalPic] = useState(false);

  const columnsPic: GridColDef<TComponentAssignmentItem>[] = [
    {
      field: "nip",
      headerName: "NIP",
      width: 150,
      renderCell: (params) => params.row.user?.nip || "-",
    },
    {
      field: "name",
      headerName: "Nama PIC",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => params.row.user?.name || "-",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => params.row.user?.email || "-",
    },
    {
      field: "type",
      headerName: "Tipe",
      width: 150,
      renderCell: (params) => params.row.user?.type || "-",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "delete",
              type: "delete",
              onClick: () => {
                modal.confirm({
                  icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                  description: "Apakah kamu akan menghapus PIC ini ?",
                  onOk: () => {
                    const remainingUserIds = (picQuery.data?.data?.assignments || [])
                      .map((a) => a.userId)
                      .filter((uid) => uid !== params.row.userId);

                    assignPic.mutate({
                      componentId: params.id as string,
                      req: { userIds: remainingUserIds },
                    });
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];

  const columnsTarget: GridColDef<TComponentTargetItem>[] = [
    { field: "year", headerName: "Tahun", width: 100 },
    { field: "targetQ1", headerName: "Target Q1", width: 120 },
    { field: "targetQ2", headerName: "Target Q2", width: 120 },
    { field: "targetQ3", headerName: "Target Q3", width: 120 },
    { field: "targetQ4", headerName: "Target Q4", width: 120 },
    { field: "targetYear", headerName: "Target Tahunan", width: 150 },
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
              onClick: () => {
                setSelectedTarget(params.row);
                setTargetModalMode("detail");
                setOpenAddModalTarget(true);
              }
            },
            {
              key: "edit",
              type: "edit",
              onClick: () => {
                setSelectedTarget(params.row);
                setTargetModalMode("edit");
                setOpenAddModalTarget(true);
              }
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => {
                modal.confirm({
                  icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                  description: "Apakah kamu akan menghapus data ini ?",
                  onOk: () => {
                    deleteTarget.mutate({ id: params.row.id });
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];

  const onSubmit = (data: TComponentFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Kode IKP"
            control={form.control}
            name="code"
            required
            placeholder="Ex: COMP001"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Nama IKP"
            control={form.control}
            name="name"
            required
            placeholder="Ex: IKP 1"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Deskripsi"
            control={form.control}
            name="description"
            required
            placeholder="Masukkan keterangan component..."
            multiline
            rows={4}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <FormDropdownField
            label="Type Priode"
            control={form.control}
            name="periodType"
            required
            options={[
              { value: "monthly", label: "Bulanan" },
              { value: "quarterly", label: "Triwulan" },
              { value: "yearly", label: "Tahunan" },
            ]}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Source Type"
            control={form.control}
            name="sourceType"
            required
            options={[
              { value: "database", label: "Database" },
              { value: "api", label: "API" },
              { value: "manual", label: "Manual" },
            ]}
          />
        </Grid> */}
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: "24px",
        }}
      >
        <Button
          loading={loading}
          type="submit"
          variant="contained"
          sx={{ width: "150px" }}
        >
          Simpan
        </Button>
      </Stack>

      {isEdit && (
        <>
          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Target IKP
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setTargetModalMode("add");
                setOpenAddModalTarget(true);
              }}
            >
              Tambah Target IKP
            </Button>
          </Box>
          <DataTable
            loading={targetQuery.isLoading}
            rows={targetQuery?.data?.result || []}
            columns={columnsTarget}
            checkboxSelection
            paginationInfo={createPaginationInfo({
              // per_page: 10,
              total: targetQuery.data?.result?.length || 0,
              page: 1,
            })}
            hidePagination={true}
            handleChange={() => { }}
          />

          <ModalAddComponentTarget
            open={openAddModalTarget}
            onClose={() => {
              setOpenAddModalTarget(false);
              setSelectedTarget(null);
            }}
            target={selectedTarget}
            mode={targetModalMode}
          />

          <Divider sx={{ my: 4 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">
              Daftar PIC IKP
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => {
                setOpenAddModalPic(true);
              }}
            >
              Tambah PIC
            </Button>
          </Box>
          <DataTable
            loading={picQuery.isLoading || assignPic.isPending}
            rows={picQuery?.data?.data?.assignments || []}
            columns={columnsPic}
            paginationInfo={createPaginationInfo({
              total: picQuery.data?.data?.assignments?.length || 0,
              page: 1,
            })}
            hidePagination={true}
            handleChange={() => { }}
          />

          <ModalAddPic
            open={openAddModalPic}
            onClose={() => setOpenAddModalPic(false)}
            componentId={params.id as string}
            currentPicUserIds={(picQuery.data?.data?.assignments || []).map((a) => a.userId)}
          />
        </>
      )}
    </form>
  );
};

export default ComponentForm;
