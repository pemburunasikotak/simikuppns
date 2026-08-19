import { FC, useState } from "react";
import {
  Stack,
  Button,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Autocomplete,
  TextField,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import useGetUnitDetails from "../_hooks/use-get-unit-details";
import { useAssignIKUs, useUnassignIKUs } from "@/app/proker/unit/[id]/_hooks/use-iku-mutations";
import useGetListIKU from "@/app/proker/unit/[id]/_hooks/use-get-list-iku";
import TabPanel from "./tab-panel";
import { getErrorMessage } from "./utils";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { useFilter } from "@/app/_hooks/use-filter";

type TIkuItem = {
  id: string;
  code: string;
  name: string;
  unit?: string;
  isDirectInput?: boolean;
  [key: string]: unknown;
};

interface IKUTabProps {
  unitId: string;
  value: number;
  index: number;
}

const IKUTab: FC<IKUTabProps> = ({ unitId, value, index }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<Record<string, unknown>>();

  const [isAssignIKUOpen, setIsAssignIKUOpen] = useState(false);
  const [selectedIKUIds, setSelectedIKUIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isUnassignIKUOpen, setIsUnassignIKUOpen] = useState(false);
  const [unassignIKUIds, setUnassignIKUIds] = useState<string[]>([]);

  const detailQuery = useGetUnitDetails(unitId);
  const allIKUsQuery = useGetListIKU({ limit: 100, page: 1 });

  const assignIKUMutation = useAssignIKUs(unitId);
  const unassignIKUMutation = useUnassignIKUs(unitId);

  const extractArray = (res: unknown): TIkuItem[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res as TIkuItem[];
    if (typeof res === "object") {
      const r = res as Record<string, unknown>;
      if (Array.isArray(r.data)) return r.data as TIkuItem[];
      if (r.data && typeof r.data === "object") {
        const d = r.data as Record<string, unknown>;
        if (Array.isArray(d.data)) return d.data as TIkuItem[];
        if (Array.isArray(d.items)) return d.items as TIkuItem[];
      }
      if (Array.isArray(r.items)) return r.items as TIkuItem[];
    }
    return [];
  };

  const assignedIKUs = extractArray(detailQuery.data?.ikus).map((i) => (i.iku as TIkuItem) || i);
  const allIKUs = extractArray(allIKUsQuery.data);
  const assignedIKUIdSet = new Set(assignedIKUs.map((i) => i.id));

  const availableIKUs = allIKUs.filter((iku) => !assignedIKUIdSet.has(iku.id));
  const filteredAvailableIKUs = availableIKUs.filter(
    (iku) =>
      iku.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iku.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignIKU = async () => {
    if (selectedIKUIds.length === 0) return;
    try {
      await assignIKUMutation.mutateAsync({ ikuIds: selectedIKUIds });
      enqueueSnackbar("IKU berhasil ditetapkan ke unit", { variant: "success" });
      setIsAssignIKUOpen(false);
      setSelectedIKUIds([]);
      setSearchQuery("");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menetapkan IKU"), { variant: "error" });
    }
  };

  const handleUnassignIKU = async () => {
    if (unassignIKUIds.length === 0) return;
    try {
      await unassignIKUMutation.mutateAsync({ ikuIds: unassignIKUIds });
      enqueueSnackbar("IKU berhasil dihapus dari unit", { variant: "success" });
      setIsUnassignIKUOpen(false);
      setUnassignIKUIds([]);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menghapus IKU"), { variant: "error" });
    }
  };

  const ikuColumns: GridColDef<TIkuItem>[] = [
    {
      field: "code",
      headerName: "Kode IKU",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: alpha("#1976d2", 0.08),
            color: "#1976d2",
            fontWeight: 700,
            borderRadius: "6px",
          }}
        />
      ),
    },
    { field: "name", headerName: "Nama IKU", minWidth: 200, flex: 1 },
    { field: "unit", headerName: "Satuan", width: 120 },
    {
      field: "isDirectInput",
      headerName: "Tipe Input",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Direct Input" : "Kalkulasi"}
          color={params.value ? "primary" : "default"}
          size="small"
        />
      ),
    },
  ];

  return (
    <TabPanel value={value} index={index}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
        {/* {assignedIKUs.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() => setIsUnassignIKUOpen(true)}
          >
            Hapus IKU
          </Button>
        )} */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAssignIKUOpen(true)}
        >
          Tambah IKU
        </Button>
      </Stack>

      <DataTable
        loading={detailQuery.isLoading}
        rows={assignedIKUs}
        columns={ikuColumns}
        paginationInfo={createPaginationInfo({
          per_page: filters.limit ? Number(filters.limit) : 50,
          total: assignedIKUs.length,
          page: filters.page ? Number(filters.page) : 1,
        })}
        handleChange={setFilter}
      />

      {/* ─── Dialog: Assign IKU ──────────────────────────────────────────── */}
      <Dialog
        open={isAssignIKUOpen}
        onClose={() => setIsAssignIKUOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Tambah IKU ke Unit</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari nama atau kode IKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" px={0.5}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {selectedIKUIds.length} dari {availableIKUs.length} IKU dipilih
              </Typography>
              {availableIKUs.length > 0 && (
                <Button
                  size="small"
                  onClick={() => {
                    if (selectedIKUIds.length === availableIKUs.length) {
                      setSelectedIKUIds([]);
                    } else {
                      setSelectedIKUIds(availableIKUs.map((i) => i.id));
                    }
                  }}
                  sx={{ textTransform: "none", fontSize: "0.8rem" }}
                >
                  {selectedIKUIds.length === availableIKUs.length ? "Batal Pilih Semua" : "Pilih Semua"}
                </Button>
              )}
            </Box>

            <Paper variant="outlined" sx={{ maxHeight: 320, overflow: "auto", borderRadius: 2 }}>
              {allIKUsQuery.isLoading ? (
                <Box p={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Memuat data IKU...
                  </Typography>
                </Box>
              ) : filteredAvailableIKUs.length === 0 ? (
                <Box p={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? "IKU tidak ditemukan." : "Semua IKU sudah ditambahkan ke unit ini."}
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {filteredAvailableIKUs.map((iku, idx) => {
                    const isChecked = selectedIKUIds.includes(iku.id);
                    return (
                      <Box key={iku.id}>
                        {idx > 0 && <Divider component="li" />}
                        <ListItemButton
                          onClick={() => {
                            if (isChecked) {
                              setSelectedIKUIds(selectedIKUIds.filter((id) => id !== iku.id));
                            } else {
                              setSelectedIKUIds([...selectedIKUIds, iku.id]);
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Checkbox
                              edge="start"
                              checked={isChecked}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={iku.code}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha("#1976d2", 0.08),
                                    color: "#1976d2",
                                    fontWeight: 700,
                                    borderRadius: "6px",
                                  }}
                                />
                                <Typography variant="body2" fontWeight={600}>
                                  {iku.name}
                                </Typography>
                              </Stack>
                            }
                            secondary={iku.unit ? `Satuan: ${iku.unit}` : undefined}
                          />
                        </ListItemButton>
                      </Box>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsAssignIKUOpen(false)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            disabled={selectedIKUIds.length === 0 || assignIKUMutation.isPending}
            onClick={handleAssignIKU}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {assignIKUMutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Dialog: Unassign IKU ────────────────────────────────────────── */}
      <Dialog
        open={isUnassignIKUOpen}
        onClose={() => setIsUnassignIKUOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, color: "error.main" }}>
          Hapus IKU dari Unit
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Autocomplete
              multiple
              options={assignedIKUs}
              getOptionLabel={(opt) => `${opt.code ? opt.code + " - " : ""}${opt.name}`}
              onChange={(_, val) => setUnassignIKUIds(val.map((v) => v.id))}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Pilih IKU yang akan dihapus"
                  placeholder="Cari IKU..."
                />
              )}
              renderTags={(val, getTagProps) =>
                val.map((option, idx) => (
                  <Chip
                    label={option.code || option.name}
                    size="small"
                    color="error"
                    {...getTagProps({ index: idx })}
                  />
                ))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsUnassignIKUOpen(false)}
            sx={{ fontWeight: 700, color: "text.secondary" }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={unassignIKUIds.length === 0 || unassignIKUMutation.isPending}
            onClick={handleUnassignIKU}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {unassignIKUMutation.isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogActions>
      </Dialog>
    </TabPanel>
  );
};

export default IKUTab;
