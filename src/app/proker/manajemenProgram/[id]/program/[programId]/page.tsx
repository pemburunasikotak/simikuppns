import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Typography, Box, Paper, Grid, Button, Autocomplete, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ArrowBack, Add } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";

import useGetDefaultProgram from "../../../_hooks/use-get-default-program";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useDeleteProgramIndicator from "./_hooks/use-delete-program-indicator";
import useAssignProgramIndicator from "./_hooks/use-assign-program-indicator";
// import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";

import ModalAddIndicator from "./_components/modal-add-indicator";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";

const DetailProgramPage = () => {
  const { id, programId } = useParams<{ id: string; programId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const modal = useModal();

  const [openModalIndicator, setOpenModalIndicator] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedIndicator, setSelectedIndicator] = useState<TDefaultProgramIndicator | null>(null);

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignPayload, setAssignPayload] = useState<{ unitId: string; defaultProgramIndicatorId: string; period: number } | null>(null);

  const { data: unitsDataResponse } = useGetProkerUnits();
  const unitsData = { items: unitsDataResponse?.items || [] };

  console.log('CEK CEK12', unitsData)
  const assignMutation = useAssignProgramIndicator();

  const { data: response, isLoading } = useGetDefaultProgram(programId as string, !!programId);
  const program = response?.data;

  const indicators = program?.indicators || [];
  const deleteMutation = useDeleteProgramIndicator();

  const columns: GridColDef<TDefaultProgramIndicator>[] = [
    { field: "name", headerName: "Nama Indikator", minWidth: 250, flex: 1 },
    {
      field: "unit",
      headerName: "Satuan",
      width: 150,
      renderCell: (params) =>
        typeof params.row.masterUnitType === "string"
          ? params.row.masterUnitType
          : params.row.masterUnitType?.name?.toString() || "-",
    },
    // { field: "status", headerName: "Status", width: 150 },
    // { field: "order", headerName: "Urutan", width: 100, align: "center", headerAlign: "center" },
    {
      field: "actions",
      headerName: "Aksi",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "assign",
            type: "assign" as const,
            onClick: () => {
              setAssignPayload({ defaultProgramIndicatorId: params.row.id, unitId: "", period: new Date().getFullYear() });
              setOpenAssignModal(true);
            },
          },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              setSelectedIndicator(params.row);
              setModalMode("edit");
              setOpenModalIndicator(true);
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Indikator",
                description: "Apakah Anda yakin ingin menghapus indikator?",
                onOk: () => {
                  deleteMutation.mutate(
                    { programId: programId as string, id: params.row.id },
                    {
                      onSuccess: () => {
                        enqueueSnackbar("Berhasil menghapus indikator", { variant: "success" });
                      },
                      onError: () => {
                        enqueueSnackbar("Gagal menghapus indikator", { variant: "error" });
                      },
                    }
                  );
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
    <Page
      loading={isLoading}
      title="Detail Program Default"
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/manajemenProgram",
        },
        {
          label: "Program",
          path: `/proker/manajemenProgram/${id}`,
        },
        {
          label: "Detail",
          path: null,
        },
      ]}
      topPage={
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>
        </Box>
      }
    >
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informasi Program
            </Typography>
            {/* <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Kode IKU
              </Typography>
              <Typography variant="body1">{program?.ikuCode || "-"}</Typography>
            </Box> */}
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">
                Judul Program
              </Typography>
              <Typography variant="body1">{program?.title || "-"}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Deskripsi
              </Typography>
              <Typography variant="body1">{program?.description || "-"}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }} mt={3}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" gutterBottom ml={1}>
              Daftar Indikator
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedIndicator(null);
                setModalMode("add");
                setOpenModalIndicator(true);
              }}
            >
              Tambah Indikator
            </Button>
          </Box>
          <DataTable
            loading={isLoading || deleteMutation.isPending}
            rows={indicators}
            columns={columns}
            hidePagination={true}
          />
        </Grid>
      </Grid>
      <ModalAddIndicator
        open={openModalIndicator}
        onClose={() => setOpenModalIndicator(false)}
        programId={programId as string}
        mode={modalMode}
        selectedIndicator={selectedIndicator}
      />

      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tugaskan Indikator ke Unit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Autocomplete
              options={unitsData?.items || []}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              getOptionLabel={(opt: any) => opt?.name || ""}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(_, val: any) => setAssignPayload(prev => prev ? { ...prev, unitId: val?.id || "" } : null)}
              renderInput={(params) => <TextField {...params} label="Pilih Unit" fullWidth />}
            />
            <TextField
              type="number"
              label="Periode (Tahun)"
              value={assignPayload?.period || ""}
              onChange={(e) => setAssignPayload(prev => prev ? { ...prev, period: Number(e.target.value) } : null)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)}>Batal</Button>
          <Button
            variant="contained"
            disabled={!assignPayload?.unitId || !assignPayload?.period || assignMutation.isPending}
            onClick={() => {
              if (assignPayload) {
                assignMutation.mutate(assignPayload, {
                  onSuccess: () => {
                    enqueueSnackbar("Berhasil menugaskan indikator", { variant: "success" });
                    setOpenAssignModal(false);
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onError: (error: any) => {
                    const errorMessage = error?.response?.data?.message || "Gagal menugaskan indikator";
                    enqueueSnackbar(errorMessage, { variant: "error" });
                  }
                });
              }
            }}
          >
            Tugaskan
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default DetailProgramPage;
