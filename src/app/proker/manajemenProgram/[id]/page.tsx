import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, TextField } from "@mui/material";
import { ArrowBack, AddOutlined, DeleteOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";

import useGetDefaultProgramsByIku from "../_hooks/use-get-default-programs-by-iku";
import useDeleteDefaultProgram from "../_hooks/use-delete-default-program";
import useAssignDefaultProgram from "../_hooks/use-assign-default-program";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";
import { TDefaultProgram, TAssignDefaultProgramPayload } from "@/api/proker/manajemenProgram/type";

const DetailDefaultProgramPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: programs, isLoading } = useGetDefaultProgramsByIku(id as string, !!id);
  const deleteMutation = useDeleteDefaultProgram();
  const assignMutation = useAssignDefaultProgram();
  const { data: unitsData } = useGetProkerUnits();
  const modal = useModal();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignPayload, setAssignPayload] = useState<TAssignDefaultProgramPayload | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns: GridColDef<TDefaultProgram>[] = [
    {
      field: "title",
      headerName: "Judul Program",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return <Typography variant="body2" color="textSecondary" sx={{ py: 1.5 }}>{params.value}</Typography>;
      }
    },
    {
      field: "description",
      headerName: "Deskripsi",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return <Typography variant="body2" color="textSecondary" sx={{ py: 1.5 }}>{params.value}</Typography>;
      }
    },
    {
      field: "indicators",
      headerName: "Jumlah Indikator",
      minWidth: 300,
      flex: 1.5,
      renderCell: (params) => {
        const indicators = params.row.indicators || [];
        return <Typography variant="body2" color="textSecondary" sx={{ py: 1.5 }}>{indicators.length} Indikator</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => {
              navigate(`/proker/manajemenProgram/${id}/program/${params.row.id}`);
            },
          },
          // {
          //   key: "assign",
          //   type: "assign" as const,
          //   onClick: () => {
          //     setAssignPayload({ defaultProgramId: params.row.id, unitId: "", period: new Date().getFullYear() });
          //     setIsAssignModalOpen(true);;
          //   },
          // },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              navigate(`/proker/manajemenProgram/${id}/program/${params.row.id}/edit`);
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Program Default",
                description: "Apakah anda yakin ingin menghapus program ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteMutation.mutate({ id: params.row.id });
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
      title="Daftar Program Default IKU"
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
          label: "Detail",
          path: null,
        },
      ]}
      topPage={
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => navigate(`/proker/manajemenProgram/tambah?ikuId=${id}`)}
          >
            Tambah Program
          </Button>
        </Box>
      }
    >
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/proker/manajemenProgram")}
        >
          Kembali
        </Button>
      </Box>

      <DataTable
        loading={isLoading}
        rows={programs || []}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: programs?.length || 10,
          total: programs?.length || 0,
          page: 1,
        })}
        // Pass getRowHeight if the underlying DataGrid supports passing extra props
        getRowHeight={() => "auto"}
      />

      <Dialog open={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tugaskan Program ke Unit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Autocomplete
              options={unitsData?.items || []}
              getOptionLabel={(opt) => opt.name}
              onChange={(_, val) => setAssignPayload(prev => prev ? { ...prev, unitId: val?.id || "" } : null)}
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
          <Button onClick={() => setIsAssignModalOpen(false)}>Batal</Button>
          <Button
            variant="contained"
            disabled={!assignPayload?.unitId || !assignPayload?.period || assignMutation.isPending}
            onClick={() => {
              if (assignPayload) {
                assignMutation.mutate(assignPayload, {
                  onSuccess: () => setIsAssignModalOpen(false)
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

export default DetailDefaultProgramPage;
