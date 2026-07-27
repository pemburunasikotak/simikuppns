import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useGetIkuUnits from "@/app/proker/manajemenProgram/[id]/program/[programId]/_hooks/use-get-iku-units";
import useAssignIndicatorToUnit from "../_hooks/use-assign-indicator-to-unit";
import { useQueryClient } from "@tanstack/react-query";
import { TErrorResponse } from "@/commons/types/response";

type ModalAssignUnitProps = {
  open: boolean;
  onClose: () => void;
  indicatorId: string | null;
  ikuId: string | null;
  period: number;
};

export default function ModalAssignUnit({ open, onClose, indicatorId, ikuId, period }: ModalAssignUnitProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { data: unitsResponse, isLoading: isLoadingUnits } = useGetIkuUnits(ikuId as string, !!ikuId);
  const units = unitsResponse?.data || [];
  const { mutate: assignIndicator, isPending } = useAssignIndicatorToUnit();
  const handleAssign = () => {
    if (!indicatorId || !selectedUnit) return;

    assignIndicator(
      {
        unitId: selectedUnit,
        defaultProgramIndicatorId: indicatorId,
        period: period,
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil menugaskan unit", { variant: "success" });
          queryClient.invalidateQueries({ queryKey: ["proker/default-programs/assignment-structure"] });
          handleClose();
        },
        onError: (err: TErrorResponse) => {
          const errorMessage = err?.response?.data?.message || "Gagal menugaskan unit";
          enqueueSnackbar(errorMessage, { variant: "error" });
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedUnit("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Unit</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Pilih unit untuk ditugaskan pada indikator ini.
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Pilih Unit</InputLabel>
          <Select
            value={selectedUnit}
            label="Pilih Unit"
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={isLoadingUnits}
          >
            {isLoadingUnits ? (
              <MenuItem value="" disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Memuat...
              </MenuItem>
            ) : units.length === 0 ? (
              <MenuItem value="" disabled>Tidak ada unit tersedia</MenuItem>
            ) : (
              units.map((u) => (
                <MenuItem key={u.unit?.id || u.id} value={u.unit?.id}>
                  {u.unit?.name || u.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>Batal</Button>
        <Button onClick={handleAssign} variant="contained" disabled={!selectedUnit || isPending}>
          {isPending ? <CircularProgress size={20} color="inherit" /> : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
