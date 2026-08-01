import { useState, useRef } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  MenuItem,
} from "@mui/material";
import { AddOutlined, FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useGetProkerMasterUnits } from "./_hooks/use-get-master-units";
import { useCreateProkerMasterUnit } from "./_hooks/use-create-master-unit";
import { useUpdateProkerMasterUnit } from "./_hooks/use-update-master-unit";
import { useDeleteProkerMasterUnit } from "./_hooks/use-delete-master-unit";
import { useExportProkerMasterUnits } from "./_hooks/use-export-master-units";
import { useImportProkerMasterUnits } from "./_hooks/use-import-master-units";
import { TProkerMasterUnit } from "@/api/proker/masterUnit/type";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";

export default function MasterUnitPage() {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  
  const queryParams = {
    ...filter,
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  };
  
  const query = useGetProkerMasterUnits(queryParams);
  const createMutation = useCreateProkerMasterUnit();
  const updateMutation = useUpdateProkerMasterUnit();
  const deleteMutation = useDeleteProkerMasterUnit();
  const exportMutation = useExportProkerMasterUnits();
  const importMutation = useImportProkerMasterUnits();

  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedUnit, setSelectedUnit] = useState<TProkerMasterUnit | null>(null);
  const [formData, setFormData] = useState({ name: "", type: "" });

  const handleOpenAdd = () => {
    setSelectedUnit(null);
    setFormData({ name: "", type: "" });
    setOpenModal(true);
  };

  const handleOpenEdit = (unit: TProkerMasterUnit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      type: unit.type,
    });
    setOpenModal(true);
  };

  const handleOpenDelete = (unit: TProkerMasterUnit) => {
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
          enqueueSnackbar("Master Unit berhasil diperbarui", { variant: "success" });
          setOpenModal(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal memperbarui master unit", { variant: "error" });
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          enqueueSnackbar("Master Unit berhasil ditambahkan", { variant: "success" });
          setOpenModal(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal menambahkan master unit", { variant: "error" });
        }
      });
    }
  };

  const handleDelete = () => {
    if (selectedUnit) {
      deleteMutation.mutate(selectedUnit.id, {
        onSuccess: () => {
          enqueueSnackbar("Master Unit berhasil dihapus", { variant: "success" });
          setOpenDelete(false);
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(error?.response?.data?.message || "Gagal menghapus master unit", { variant: "error" });
        }
      });
    }
  };

  const handleExport = () => {
    exportMutation.mutate(undefined, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "MasterUnitExport.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        enqueueSnackbar("Master Unit berhasil diexport", { variant: "success" });
      },
      onError: () => {
        enqueueSnackbar("Gagal melakukan export", { variant: "error" });
      }
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importMutation.mutate(file, {
      onSuccess: () => {
        enqueueSnackbar("Master Unit berhasil diimport", { variant: "success" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      onError: (err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        enqueueSnackbar(error?.response?.data?.message || "Gagal melakukan import", { variant: "error" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  const columns: GridColDef<TProkerMasterUnit>[] = [
    { field: "name", headerName: "Nama Unit", minWidth: 200, flex: 1 },
    { field: "type", headerName: "Tipe", minWidth: 200, flex: 1 },
    { field: "createdAt", headerName: "Dibuat Pada", minWidth: 200, valueFormatter: (value?: string) => {
        if (!value) return "-";
        return new Date(value).toLocaleString();
      } 
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const items = [
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
          label: "Master Unit",
          path: "/proker/master-unit",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Master Unit..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="export"
              variant="outlined"
              startIcon={<FileDownloadOutlined />}
              onClick={handleExport}
              disabled={exportMutation.isPending}
            >
              Export
            </Button>,
            <Button
              key="import"
              variant="outlined"
              startIcon={<FileUploadOutlined />}
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
            >
              Import
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                accept=".xlsx, .xls"
                onChange={handleImport}
              />
            </Button>,
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={handleOpenAdd}
            >
              Tambah
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
            {selectedUnit ? "Edit Master Unit" : "Tambah Master Unit"}
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
              required
              select
              margin="dense"
              name="type"
              label="Tipe Unit"
              fullWidth
              variant="outlined"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="NUMBER">NUMBER</MenuItem>
              <MenuItem value="FILE">FILE</MenuItem>
              <MenuItem value="TEXT">TEXT</MenuItem>
            </TextField>
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
            Apakah Anda yakin ingin menghapus master unit <strong>{selectedUnit?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button onClick={() => setOpenDelete(false)} color="inherit">Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleteMutation.isPending}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
