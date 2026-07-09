import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box } from "@mui/material";
import { Add, DeleteOutlined, Close, CloudUpload } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";


import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import { createPaginationInfo } from "@/utils/data-table";

import { useGetEvidences, useCreateEvidence, useDeleteEvidence } from "../_hooks/evidence/use-evidence";
import { TProkerEvidence } from "@/api/proker/aktivitas/evidence/type";

interface Props {
  activityId: string;
}

const EvidenceTable = ({ activityId }: Props) => {
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const modal = useModal();

  const { data, isLoading } = useGetEvidences(activityId, {
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value,
  });

  const createMutation = useCreateEvidence(activityId);
  const deleteMutation = useDeleteEvidence(activityId);

  const items = data?.data || [];
  const pagination = data?.pagination;

  const handleAdd = () => {
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      enqueueSnackbar("Pilih file terlebih dahulu", { variant: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengunggah evidence", { variant: "success" });
        setIsModalOpen(false);
        setSelectedFile(null);
      },
      onError: () => enqueueSnackbar("Gagal mengunggah evidence", { variant: "error" }),
    });
  };

  const columns: GridColDef<TProkerEvidence>[] = [
    { field: "fileName", headerName: "Nama File", minWidth: 250, flex: 1 },
    {
      field: "fileSize",
      headerName: "Ukuran",
      minWidth: 150,
      renderCell: (params) => {
        const kb = params.row.fileSize / 1024;
        return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
      }
    },
    { field: "uploadedBy", headerName: "Diunggah Oleh", minWidth: 150 },
    {
      field: "createdAt",
      headerName: "Waktu Upload",
      minWidth: 200,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleString("id-ID"),
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Evidence",
                description: "Apakah anda yakin ingin menghapus file ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteMutation.mutate(params.row.id, {
                    onSuccess: () => enqueueSnackbar("Berhasil menghapus evidence", { variant: "success" }),
                    onError: () => enqueueSnackbar("Gagal menghapus evidence", { variant: "error" }),
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
        labelSearch={"Cari Evidence..."}
        defaultValue={{ search_value: filter.search || filter.search_value }}
        actions={[
          <Button key="add" variant="contained" startIcon={<Add />} onClick={handleAdd}>
            Upload Evidence
          </Button>,
        ]}
      />
      <DataTable
        loading={isLoading || deleteMutation.isPending}
        rows={data?.data || []}
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
          Upload Evidence
          <IconButton onClick={() => setIsModalOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ width: '100%', py: 4, borderStyle: 'dashed', borderWidth: 2 }}
              >
                {selectedFile ? selectedFile.name : "Klik untuk memilih file"}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" color="text.secondary">
                  File terpilih: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsModalOpen(false)} variant="outlined">Batal</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending || !selectedFile}>
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default EvidenceTable;
