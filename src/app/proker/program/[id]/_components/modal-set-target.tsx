import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useSetProgramIndicatorTarget from "../../_hooks/use-set-program-indicator-target";

type ModalSetTargetProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  selectedIndicator: TDefaultProgramIndicator | null;
};

const schema = z.object({
  targetQ1: z.coerce.number().min(0, "Target Q1 minimal 0"),
  targetQ2: z.coerce.number().min(0, "Target Q2 minimal 0"),
  targetQ3: z.coerce.number().min(0, "Target Q3 minimal 0"),
  targetQ4: z.coerce.number().min(0, "Target Q4 minimal 0"),
});

type FormData = z.infer<typeof schema>;

const ModalSetTarget = ({ open, onClose, programId, selectedIndicator }: ModalSetTargetProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setTargetMutation = useSetProgramIndicatorTarget(programId);

  const isPending = setTargetMutation.isPending;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
    },
  });

  useEffect(() => {
    if (open && selectedIndicator) {
      reset({
        targetQ1: selectedIndicator.targetQ1 || 0,
        targetQ2: selectedIndicator.targetQ2 || 0,
        targetQ3: selectedIndicator.targetQ3 || 0,
        targetQ4: selectedIndicator.targetQ4 || 0,
      });
    }
  }, [open, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    if (!selectedIndicator) return;
    
    setTargetMutation.mutate(
      { id: selectedIndicator.id, payload: data },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil mengatur target indikator", { variant: "success" });
          handleClose();
        },
        onError: () => {
          enqueueSnackbar("Gagal mengatur target indikator", { variant: "error" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Assign / Set Target Indikator
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <FormTextField
              control={control}
              name="targetQ1"
              label="Target Q1"
              type="number"
              required
            />
            <FormTextField
              control={control}
              name="targetQ2"
              label="Target Q2"
              type="number"
              required
            />
            <FormTextField
              control={control}
              name="targetQ3"
              label="Target Q3"
              type="number"
              required
            />
            <FormTextField
              control={control}
              name="targetQ4"
              label="Target Q4"
              type="number"
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            sx={{ fontWeight: 700 }}
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalSetTarget;
