import { FC, ReactElement, useState } from "react";
import {
  Button,
  Chip,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { AddOutlined, CheckCircleOutlined, DeleteOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

import { useGetPrograms } from "./_hooks/use-get-list-program";
import { TProkerProgram } from "@/api/proker/program/type";
import { exportProkerExcel } from "@/api/proker/program/api";

import { Page, DocumentCell, DocumentPreviewModal } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import useDeleteProgram from "./_hooks/use-delete-program";
import useFinalisasiIndicators from "./_hooks/use-finalisasi-indicators";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";


const ProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const deleteProgram = useDeleteProgram();
  const finalisasiMutation = useFinalisasiIndicators();
  const { enqueueSnackbar } = useSnackbar();

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const { data, isLoading } = useGetPrograms({
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10
  });

  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | string>(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<string>("USULAN");
  const [isExporting, setIsExporting] = useState(false);

  const [openFinalisasiModal, setOpenFinalisasiModal] = useState(false);
  const [finalisasiYear, setFinalisasiYear] = useState<number | string>(new Date().getFullYear());

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDocs, setPreviewDocs] = useState<unknown[]>([]);
  const [previewTitle, setPreviewTitle] = useState("Pratinjau Dokumen");

  console.log('setPreviewDocs', setPreviewDocs, setPreviewTitle)

  const user = ProkerSessionUser.get()?.user;
  const userRoleKeys = user?.roles?.map((r: { key: string }) => r.key) || [];
  const isAdmin = userRoleKeys.includes("admin_sim_proker");

  const items = data?.data?.items || [];

  const handleDownloadExcel = async () => {
    if (!selectedYear) {
      enqueueSnackbar("Pilih atau masukkan tahun terlebih dahulu", { variant: "warning" });
      return;
    }
    if (!selectedType) {
      enqueueSnackbar("Pilih tipe terlebih dahulu", { variant: "warning" });
      return;
    }
    try {
      setIsExporting(true);
      const blob = await exportProkerExcel(selectedYear, selectedType);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proker-export-${selectedYear}-${selectedType}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar("Berhasil mengunduh Excel Proker", { variant: "success" });
      setOpenExportModal(false);
    } catch (error) {
      console.error("Export error:", error);
      enqueueSnackbar("Gagal mengunduh Excel Proker", { variant: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFinalisasi = () => {
    if (!finalisasiYear) {
      enqueueSnackbar("Masukkan tahun terlebih dahulu", { variant: "warning" });
      return;
    }
    finalisasiMutation.mutate(finalisasiYear, {
      onSuccess: () => {
        enqueueSnackbar(`Berhasil melakukan finalisasi indikator tahun ${finalisasiYear}`, { variant: "success" });
        setOpenFinalisasiModal(false);
      },
      onError: (err: unknown) => {
        const errorObj = err as { response?: { data?: { message?: string } } };
        enqueueSnackbar(
          errorObj?.response?.data?.message || "Gagal melakukan finalisasi indikator",
          { variant: "error" }
        );
      },
    });
  };

  const formatValue = (value?: unknown) =>
    value !== null && value !== undefined && value !== "" ? String(value) : "-";

  const columns: GridColDef<TProkerProgram>[] = [
    { field: "code", headerName: "Kode Program", width: 150, valueFormatter: formatValue },
    { field: "title", headerName: "Nama Program", minWidth: 200, flex: 1, valueFormatter: formatValue },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1, valueFormatter: formatValue },
    { field: "objective", headerName: "Objective", minWidth: 200, flex: 1, valueFormatter: formatValue },
    { field: "year", headerName: "Tahun", width: 100, valueFormatter: formatValue },
    {
      field: "indicators",
      headerName: "Indikator",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const indicators = params.row.indicators || [];
        if (indicators.length === 0) return "-";

        return (
          <Tooltip title={indicators.map((ind) => ind.name).join(", ")}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%", overflow: "hidden" }}>
              {indicators.slice(0, 2).map((ind, i) => (
                <Chip key={i} label={ind.name} size="small" variant="outlined" />
              ))}
              {indicators.length > 2 && (
                <Chip label={`+${indicators.length - 2}`} size="small" variant="outlined" />
              )}
            </Stack>
          </Tooltip>
        );
      },
    },
    {
      field: "documents",
      headerName: "Dokumen",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const indicators = params.row.indicators || [];
        const allDocs: { label: string; doc: unknown }[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        indicators.forEach((ind: any) => {
          const proposalDoc = ind.proposalURL || ind.proposalDocument || ind.propsal || ind.proposalDocumentId;
          const rabDoc = ind.rabURL || ind.rabDocument || ind.rab || ind.rabDocumentId;
          if (proposalDoc) allDocs.push({ label: "TOR", doc: proposalDoc });
          if (rabDoc) allDocs.push({ label: "RAB", doc: rabDoc });
        });

        if (allDocs.length === 0) return "-";

        return <DocumentCell documents={allDocs} title={`Dokumen Program: ${params.row.title}`} />;
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
              navigate(`/proker/program/${params.row.id}`);
            },
          },
          ...(isAdmin
            ? [
              {
                key: "edit",
                type: "edit" as const,
                onClick: () => {
                  navigate(`/proker/program/${params.row.id}/edit`);
                },
              },
              {
                key: "delete",
                type: "delete" as const,
                onClick: () => {
                  modal.confirm({
                    title: "Hapus Program",
                    description: "Apakah anda yakin ingin menghapus program ini?",
                    icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                    onOk: () => {
                      deleteProgram.mutate({ id: params.row.id });
                    },
                  });
                },
              },
            ]
            : []),
        ];
        return <ActionButtonTable items={actionItems} />;
      },
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Proker Program",
          path: "/proker",
        },
        {
          label: "Program",
          path: "/proker/program",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Program..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={
            isAdmin
              ? [
                <Button
                  key="export-excel"
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadOutlined />}
                  onClick={() => setOpenExportModal(true)}
                >
                  Unduh Excel
                </Button>,
                <Button
                  key="finalisasi"
                  variant="outlined"
                  color="success"
                  startIcon={<CheckCircleOutlined />}
                  onClick={() => setOpenFinalisasiModal(true)}
                  disabled={finalisasiMutation.isPending}
                >
                  Finalisasi
                </Button>,
                <Button
                  key="add"
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={() => {
                    navigate("/proker/program/tambah");
                  }}
                >
                  Tambah Program
                </Button>,
              ]
              : []
          }
        />
      }
    >
      <DataTable
        loading={isLoading}
        rows={items}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: data?.data?.pagination?.totalItems || 0,
          page: data?.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />

      {/* ── Dialog Export Excel ── */}
      <Dialog open={openExportModal} onClose={() => setOpenExportModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Unduh Excel Proker</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Pilih tahun dan tipe program kerja yang ingin diunduh format Excel.
            </Typography>
            <TextField
              label="Tahun"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              fullWidth
              placeholder="Contoh: 2025"
            />
            <TextField
              select
              label="Tipe"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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

      {/* ── Dialog Finalisasi Indikator ── */}
      <Dialog open={openFinalisasiModal} onClose={() => setOpenFinalisasiModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">Finalisasi Indikator</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Stack spacing={2}>
            {/* <Typography variant="body2" color="text.secondary">
              Apakah Anda yakin ingin melakukan finalisasi indikator untuk tahun {finalisasiYear || "..."}?
            </Typography> */}
            <TextField
              label="Tahun"
              type="number"
              value={finalisasiYear}
              onChange={(e) => setFinalisasiYear(e.target.value)}
              fullWidth
              placeholder="Contoh: 2025"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button onClick={() => setOpenFinalisasiModal(false)} color="inherit" disabled={finalisasiMutation.isPending}>
            Batal
          </Button>
          <Button
            onClick={handleFinalisasi}
            variant="contained"
            color="success"
            disabled={finalisasiMutation.isPending}
            startIcon={finalisasiMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <CheckCircleOutlined />}
          >
            {finalisasiMutation.isPending ? "Memproses..." : "Finalisasi"}
          </Button>
        </DialogActions>
      </Dialog>

      <DocumentPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={previewTitle}
        documents={previewDocs}
      />
    </Page>
  );
};

export default ProgramPage;
