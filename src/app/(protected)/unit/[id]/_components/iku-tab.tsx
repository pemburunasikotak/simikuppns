import { FC, useState } from "react";
import {
  Stack,
  Button,
  Box,
  CircularProgress,
  Typography,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Autocomplete,
  TextField,
} from "@mui/material";
import { AssignmentOutlined, DeleteOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import useGetUnitIKUs from "../_hooks/use-get-unit-ikus";
import { useAssignIKUs, useUnassignIKUs } from "../_hooks/use-iku-mutations";
import useGetListIKU from "../../../master/iku/_hooks/use-get-list-iku";
import TabPanel from "./tab-panel";
import { getErrorMessage } from "./utils";

interface IKUTabProps {
  unitId: string;
  value: number;
  index: number;
}

const IKUTab: FC<IKUTabProps> = ({ unitId, value, index }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [isAssignIKUOpen, setIsAssignIKUOpen] = useState(false);
  const [selectedIKUIds, setSelectedIKUIds] = useState<string[]>([]);
  
  const [isUnassignIKUOpen, setIsUnassignIKUOpen] = useState(false);
  const [unassignIKUIds, setUnassignIKUIds] = useState<string[]>([]);

  const ikuQuery = useGetUnitIKUs(unitId);
  const allIKUsQuery = useGetListIKU({ limit: 100, page: 1 });

  const assignIKUMutation = useAssignIKUs(unitId);
  const unassignIKUMutation = useUnassignIKUs(unitId);

  const assignedIKUs = ikuQuery.data?.data?.ikus?.map((i) => i.iku) || [];
  const allIKUs = allIKUsQuery.data?.result?.data || [];
  const assignedIKUIdSet = new Set(assignedIKUs.map((i) => i.id));

  const handleAssignIKU = async () => {
    if (selectedIKUIds.length === 0) return;
    try {
      await assignIKUMutation.mutateAsync({ ikuIds: selectedIKUIds });
      enqueueSnackbar("IKU berhasil ditetapkan ke unit", { variant: "success" });
      setIsAssignIKUOpen(false);
      setSelectedIKUIds([]);
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

  return (
    <TabPanel value={value} index={index}>
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 2 }}>
        {assignedIKUs.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() => setIsUnassignIKUOpen(true)}
          >
            Hapus IKU
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<AssignmentOutlined />}
          onClick={() => setIsAssignIKUOpen(true)}
        >
          Tetapkan IKU
        </Button>
      </Stack>

      {ikuQuery.isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : assignedIKUs.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            bgcolor: "grey.50",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "grey.300",
          }}
        >
          <AssignmentOutlined sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
          <Typography color="text.secondary">
            Belum ada IKU yang ditetapkan ke unit ini
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {assignedIKUs.map((iku) => (
            <Box
              key={iku.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
                bgcolor: "background.paper",
                "&:hover": { bgcolor: alpha("#1976d2", 0.04) },
              }}
            >
              {iku.code && (
                <Chip
                  label={iku.code}
                  size="small"
                  sx={{
                    backgroundColor: alpha("#1976d2", 0.08),
                    color: "#1976d2",
                    fontWeight: 700,
                    borderRadius: "6px",
                    minWidth: 60,
                  }}
                />
              )}
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {iku.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {/* ─── Dialog: Assign IKU ──────────────────────────────────────────── */}
      <Dialog
        open={isAssignIKUOpen}
        onClose={() => setIsAssignIKUOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Tetapkan IKU ke Unit</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Autocomplete
              multiple
              options={allIKUs.filter((iku) => !assignedIKUIdSet.has(iku.id))}
              getOptionLabel={(opt) => `${opt.code} - ${opt.name}`}
              loading={allIKUsQuery.isLoading}
              onChange={(_, val) => setSelectedIKUIds(val.map((v) => v.id))}
              renderInput={(params) => (
                <TextField {...params} label="Pilih IKU" placeholder="Cari IKU..." />
              )}
              renderTags={(val, getTagProps) =>
                val.map((option, idx) => (
                  <Chip
                    label={option.code}
                    size="small"
                    {...getTagProps({ index: idx })}
                    sx={{
                      backgroundColor: alpha("#1976d2", 0.08),
                      color: "#1976d2",
                      fontWeight: 600,
                    }}
                  />
                ))
              }
            />
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
            {assignIKUMutation.isPending ? "Menyimpan..." : "Tetapkan"}
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
