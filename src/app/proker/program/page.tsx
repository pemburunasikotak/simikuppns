import { FC, ReactElement, useState, useEffect, useMemo, ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
  Stack,
  InputAdornment,
  Pagination,
  Select,
  FormControl,
  Skeleton,
  Tooltip,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  AddOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
  TableRowsOutlined,
  ViewListOutlined,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";

import { useGetPrograms } from "./_hooks/use-get-list-program";
import { TProkerProgram } from "@/api/proker/program/type";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import { exportProkerExcel } from "@/api/proker/program/api";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import useDeleteProgram from "./_hooks/use-delete-program";
import useDeleteProgramIndicator from "./_hooks/use-delete-program-indicator";
import useFinalisasiIndicators from "./_hooks/use-finalisasi-indicators";
import useGetMyUnits from "@/app/proker/unit/_hooks/use-get-my-units";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";
import { useFilter } from "@/app/_hooks/use-filter";
import { useDebounce } from "@/app/_hooks/use-debounce";

import ProgramItemCard from "./_components/program-item-card";
import ModalSetTarget from "./[id]/_components/modal-set-target";
import ModalAddIndicator from "./[id]/_components/modal-add-indicator";

const ProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const deleteProgram = useDeleteProgram();
  const deleteIndicator = useDeleteProgramIndicator();
  const finalisasiMutation = useFinalisasiIndicators();
  const { enqueueSnackbar } = useSnackbar();
  const debounce = useDebounce();

  // View mode: 'tabel' (format data grid) atau 'list' (format kartu accordion)
  const [viewMode, setViewMode] = useState<"tabel" | "list">(() => {
    try {
      return (localStorage.getItem("proker_program_view_mode") as "tabel" | "list") || "tabel";
    } catch {
      return "tabel";
    }
  });

  const handleSetViewMode = (newMode: "tabel" | "list") => {
    setViewMode(newMode);
    try {
      localStorage.setItem("proker_program_view_mode", newMode);
    } catch (error) {
      console.warn("Gagal menyimpan view mode ke localStorage", error);
    }
  };

  const { filters: filter, setFilter } = useFilter<{
    page?: number;
    per_page?: number;
    search?: string;
    search_value?: string;
  }>();

  const [searchTerm, setSearchTerm] = useState(filter.search || filter.search_value || "");

  const isSearching = Boolean(filter.search || filter.search_value);
  const currentPage = isSearching ? 1 : (filter.page ? Number(filter.page) : 1);
  const perPage = filter.per_page ? Number(filter.per_page) : 50;

  const { data, isLoading } = useGetPrograms({
    page: currentPage,
    limit: perPage,
    search: filter.search || filter.search_value || undefined,
  });

  const rawItems = data?.data?.items || [];
  const totalItems = data?.data?.pagination?.totalItems || rawItems.length;
  const totalPages = data?.data?.pagination?.totalPages || Math.ceil(totalItems / perPage) || 1;

  // Search input change handler with debounce
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounce({
      cb: () => {
        setFilter({
          search_value: value || undefined,
          search: undefined,
          page: 1,
        });
      },
    });
  };

  // Expanded items state for 'list' view (semua item bisa ditutup / dibuka bebas)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Both table and list views use the exact same data from the API
  const items = rawItems;

  // Modals for execution
  const [selectedProgram, setSelectedProgram] = useState<TProkerProgram | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<TDefaultProgramIndicator | null>(null);
  const [targetModalOpen, setTargetModalOpen] = useState(false);
  const [indicatorModalOpen, setIndicatorModalOpen] = useState(false);
  const [indicatorModalMode, setIndicatorModalMode] = useState<"add" | "edit" | "detail">("add");

  const handleOpenSetTarget = (prog: TProkerProgram, ind: TDefaultProgramIndicator) => {
    setSelectedProgram(prog);
    setSelectedIndicator(ind);
    setTargetModalOpen(true);
  };

  const handleOpenAddIndicator = (prog: TProkerProgram) => {
    setSelectedProgram(prog);
    setSelectedIndicator(null);
    setIndicatorModalMode("add");
    setIndicatorModalOpen(true);
  };

  const handleOpenEditIndicator = (prog: TProkerProgram, ind: TDefaultProgramIndicator) => {
    setSelectedProgram(prog);
    setSelectedIndicator(ind);
    setIndicatorModalMode("edit");
    setIndicatorModalOpen(true);
  };

  const handleDeleteIndicator = (prog: TProkerProgram, ind: TDefaultProgramIndicator) => {
    modal.confirm({
      title: "Hapus Indikator",
      description: `Apakah anda yakin ingin menghapus indikator "${ind.name}"?`,
      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
      onOk: () => {
        if (prog.id && ind.id) {
          deleteIndicator.mutate(
            { programId: prog.id, id: ind.id },
            {
              onSuccess: () => {
                enqueueSnackbar("Berhasil menghapus indikator", { variant: "success" });
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onError: (error: any) => {
                enqueueSnackbar(error?.response?.data?.message || "Gagal menghapus indikator", {
                  variant: "error",
                });
              },
            }
          );
        }
      },
    });
  };

  const handleEditProgram = (prog: TProkerProgram) => {
    navigate(`/proker/program/${prog.id}/edit`);
  };

  const handleDeleteProgram = (prog: TProkerProgram) => {
    modal.confirm({
      title: "Hapus Program",
      description: "Apakah anda yakin ingin menghapus program ini?",
      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
      onOk: () => {
        if (prog.id) {
          deleteProgram.mutate({ id: prog.id });
        }
      },
    });
  };

  // Export Excel state
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | string>(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState<string>("USULAN");
  const [isExporting, setIsExporting] = useState(false);

  // Finalisasi state
  const [openFinalisasiModal, setOpenFinalisasiModal] = useState(false);
  const [finalisasiYear, setFinalisasiYear] = useState<number | string>(new Date().getFullYear());

  const user = ProkerSessionUser.get()?.user;
  const userRoleKeys = user?.roles?.map((r: { key: string }) => r.key) || [];
  const isAdmin = userRoleKeys.includes("admin_sim_proker");

  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const { data: myUnitsData } = useGetMyUnits({ limit: 50 });
  const myUnitOptions = useMemo(() => {
    return (
      myUnitsData?.map((item) => ({
        value: item?.unit?.id || item?.id || "",
        label: item?.unit?.name || item?.name || "",
      })) || []
    );
  }, [myUnitsData]);

  useEffect(() => {
    if (myUnitOptions.length > 0 && !selectedUnitId) {
      setSelectedUnitId(myUnitOptions[0].value);
    }
  }, [myUnitOptions, selectedUnitId]);

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
      const blob = await exportProkerExcel(selectedYear, selectedType, !isAdmin ? selectedUnitId : undefined);
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
        enqueueSnackbar(`Berhasil melakukan finalisasi indikator tahun ${finalisasiYear}`, {
          variant: "success",
        });
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

  // Table columns definition for 'tabel' (versi lama)
  const formatValue = (value?: unknown) =>
    value !== null && value !== undefined && value !== "" ? String(value) : "-";

  const tableColumns: GridColDef<TProkerProgram>[] = useMemo(
    () => [
      { field: "code", headerName: "Kode Program", width: 150, valueFormatter: formatValue },
      { field: "title", headerName: "Nama Program", minWidth: 200, flex: 1, valueFormatter: formatValue },
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
        field: "unit",
        headerName: "Unit",
        minWidth: 200,
        flex: 1,
        renderCell: (params) => {
          const indicators = params.row.indicators || [];

          // Ambil nama unit langsung dari tiap indikator, buang kosong & duplikat
          const units: string[] = Array.from(
            new Set(
              indicators
                .map((ind: TDefaultProgramIndicator) =>
                  typeof ind?.unit === "object" ? ind?.unit?.name : ind?.unit,
                )
                .filter(Boolean),
            ),
          ) as string[];

          if (units.length === 0) return "-";

          return (
            <Tooltip title={units.join(", ")}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ height: "100%", overflow: "hidden" }}
              >
                {units.slice(0, 2).map((unitName) => (
                  <Chip key={unitName} label={unitName} size="small" variant="outlined" />
                ))}
                {units.length > 2 && (
                  <Chip label={`+${units.length - 2}`} size="small" variant="outlined" />
                )}
              </Stack>
            </Tooltip>
          );
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
                        if (params.row.id) {
                          deleteProgram.mutate({ id: params.row.id as string });
                        }
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
    ],
    [isAdmin, navigate, modal, deleteProgram]
  );

  return (
    <Page
      noPaper={true}
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
    >
      {/* ── Top Bar / Search & Action Bar ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "stretch", lg: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        {/* Search Input */}
        <TextField
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari program atau indikator..."
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#ffffff",
              borderRadius: "10px",
              height: 44,
              "& fieldset": {
                borderColor: "#E2E8F0",
              },
              "&:hover fieldset": {
                borderColor: "#CBD5E1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0D6836",
              },
            },
            "& .MuiOutlinedInput-input": {
              fontSize: "14px",
              color: "#1E293B",
              "&::placeholder": {
                color: "#94A3B8",
                opacity: 1,
              },
            },
          }}
        />

        {/* View Mode Toggle (Tabel / List) & Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ flexShrink: 0 }}
        >
          {/* ToggleButtonGroup: Tabel vs List */}
          <Tooltip title={viewMode === "tabel" ? "Tampilan Tabel" : "Tampilan List"} arrow>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_e, val) => { if (val) handleSetViewMode(val as "tabel" | "list"); }}
              size="small"
              aria-label="view mode"
              sx={{
                height: 44,
                bgcolor: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                overflow: "hidden",
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: 0,
                  px: 1.8,
                  color: "#94A3B8",
                  fontSize: "13px",
                  fontWeight: 600,
                  gap: 0.7,
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    bgcolor: "#0D6836",
                    color: "#ffffff",
                    "&:hover": { bgcolor: "#0A532B" },
                  },
                  "&:hover": { bgcolor: "#F1F5F9" },
                  "&:first-of-type": { borderRadius: "9px 0 0 9px" },
                  "&:last-of-type": { borderRadius: "0 9px 9px 0" },
                },
              }}
            >
              <ToggleButton value="tabel" aria-label="tabel">
                <TableRowsOutlined sx={{ fontSize: 18 }} />
                <span>Tabel</span>
              </ToggleButton>
              <ToggleButton value="list" aria-label="list">
                <ViewListOutlined sx={{ fontSize: 18 }} />
                <span>List</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </Tooltip>

          {/* Unduh Excel Button */}
          <Button
            variant="outlined"
            onClick={() => setOpenExportModal(true)}
            sx={{
              height: 44,
              borderRadius: "10px",
              borderColor: "#E2E8F0",
              color: "#0D6836",
              bgcolor: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              px: { xs: 2, sm: 2.5 },
              whiteSpace: "nowrap",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              "&:hover": {
                borderColor: "#0D6836",
                bgcolor: "rgba(13, 104, 54, 0.04)",
              },
            }}
          >
            Unduh Excel
          </Button>

          {/* Finalisasi Button (Admin only) */}
          {isAdmin && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleOutlined />}
              onClick={() => setOpenFinalisasiModal(true)}
              disabled={finalisasiMutation.isPending}
              sx={{
                height: 44,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                px: { xs: 2, sm: 2.5 },
                whiteSpace: "nowrap",
              }}
            >
              Finalisasi
            </Button>
          )}

          {/* Tambah Program Button */}
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => {
              navigate("/proker/program/tambah");
            }}
            sx={{
              height: 44,
              borderRadius: "10px",
              bgcolor: "#0D6836",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              px: { xs: 2, sm: 2.5 },
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0A532B",
                boxShadow: "none",
              },
            }}
          >
            Tambah Program
          </Button>
        </Stack>
      </Box>

      {/* ── Content: Tabel (Versi Lama) vs List (Versi Baru) ── */}
      {viewMode === "tabel" ? (
        /* Versi Lama: DataTable */
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
          }}
        >
          <DataTable
            loading={isLoading}
            rows={items}
            columns={tableColumns}
            checkboxSelection={false}
            paginationInfo={createPaginationInfo({
              per_page: perPage,
              total: totalItems,
              page: currentPage,
            })}
            handleChange={(pagination) => {
              setFilter({
                ...pagination,
              });
            }}
          />
        </Paper>
      ) : (
        /* Versi Baru: List Accordion Cards */
        <Box>
          {isLoading ? (
            <Stack spacing={2}>
              <Skeleton variant="rounded" height={80} sx={{ borderRadius: "14px" }} />
              <Skeleton variant="rounded" height={80} sx={{ borderRadius: "14px" }} />
              <Skeleton variant="rounded" height={80} sx={{ borderRadius: "14px" }} />
            </Stack>
          ) : items.length === 0 ? (
            <Box
              sx={{
                bgcolor: "#ffffff",
                borderRadius: "14px",
                border: "1px dashed #CBD5E1",
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} color="#64748B" gutterBottom>
                Tidak ada program ditemukan
              </Typography>
              <Typography variant="body2" color="#94A3B8">
                {searchTerm
                  ? `Tidak ada hasil untuk pencarian "${searchTerm}". Coba kata kunci lain.`
                  : "Belum ada data program yang terdaftar."}
              </Typography>
            </Box>
          ) : (
            <Box>
              {items.map((program) => {
                const programKey = program.id || program.code;
                const isExpanded = expandedIds.has(programKey);

                return (
                  <ProgramItemCard
                    key={programKey}
                    program={program}
                    isExpanded={isExpanded}
                    onToggle={() => handleToggleExpand(programKey)}
                    isAdmin={isAdmin}
                    onAddIndicator={handleOpenAddIndicator}
                    onSetTarget={handleOpenSetTarget}
                    onEditIndicator={handleOpenEditIndicator}
                    onDeleteIndicator={handleDeleteIndicator}
                    onEditProgram={handleEditProgram}
                    onDeleteProgram={handleDeleteProgram}
                  />
                );
              })}

              {/* ── Pagination Controls for List View ── */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid #E2E8F0",
                }}
              >
                <Typography variant="body2" color="#64748B">
                  Menampilkan {items.length > 0 ? (currentPage - 1) * perPage + 1 : 0} -{" "}
                  {Math.min(currentPage * perPage, totalItems)} dari {totalItems} program
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="#64748B">
                      Baris per halaman:
                    </Typography>
                    <FormControl size="small">
                      <Select
                        value={perPage}
                        onChange={(e) => {
                          setFilter({
                            per_page: Number(e.target.value),
                            page: 1,
                          });
                        }}
                        sx={{
                          height: 32,
                          fontSize: "13px",
                          bgcolor: "#ffffff",
                          borderRadius: "6px",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E2E8F0",
                          },
                        }}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => {
                      setFilter({ page });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    color="primary"
                    shape="rounded"
                    size="medium"
                  />
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      )}

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
            {!isAdmin && (
              <TextField
                select
                label="Unit"
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                fullWidth
              >
                {myUnitOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
          >
            {isExporting ? <CircularProgress size={20} color="inherit" /> : "Unduh Excel"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog Finalisasi Indikator ── */}
      <Dialog
        open={openFinalisasiModal}
        onClose={() => setOpenFinalisasiModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight="bold">Finalisasi Indikator</DialogTitle>
        <Divider />
        <DialogContent dividers>
          <Stack spacing={2}>
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
          <Button
            onClick={() => setOpenFinalisasiModal(false)}
            color="inherit"
            disabled={finalisasiMutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleFinalisasi}
            variant="contained"
            color="success"
            disabled={finalisasiMutation.isPending}
            startIcon={
              finalisasiMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CheckCircleOutlined />
              )
            }
          >
            {finalisasiMutation.isPending ? "Memproses..." : "Finalisasi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Modal Set Target (Direct Execution) ── */}
      {selectedProgram && (
        <ModalSetTarget
          open={targetModalOpen}
          onClose={() => {
            setTargetModalOpen(false);
            setSelectedProgram(null);
            setSelectedIndicator(null);
          }}
          programId={selectedProgram.id || ""}
          programTitle={selectedProgram.title}
          selectedIndicator={selectedIndicator}
        />
      )}

      {/* ── Modal Add / Edit Indicator (Direct Execution) ── */}
      {selectedProgram && (
        <ModalAddIndicator
          open={indicatorModalOpen}
          onClose={() => {
            setIndicatorModalOpen(false);
            setSelectedProgram(null);
            setSelectedIndicator(null);
          }}
          programId={selectedProgram.id || ""}
          mode={indicatorModalMode}
          selectedIndicator={selectedIndicator}
        />
      )}
    </Page>
  );
};

export default ProgramPage;
