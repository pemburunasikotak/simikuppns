import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import useAddIndicatorRealization from "../../../../_hooks/use-add-indicator-realization";

type ModalAddRealizationProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  indicatorId: string | null;
};

const schema = z.object({
  month: z.coerce.number().min(1).max(12),
  realization: z.coerce.number().min(0, "Realisasi minimal 0"),
  remark: z.string().min(1, "Catatan wajib diisi"),
});

type FormData = z.infer<typeof schema>;

const ModalAddRealization = ({ open, onClose, programId, indicatorId }: ModalAddRealizationProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const addRealizationMutation = useAddIndicatorRealization(programId);

  const isPending = addRealizationMutation.isPending;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      realization: 0,
      remark: "",
    },
  });

  useEffect(() => {
    if (open && indicatorId) {
      reset({
        month: new Date().getMonth() + 1,
        realization: 0,
        remark: "",
      });
    }
  }, [open, indicatorId, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    if (!indicatorId) return;
    
    addRealizationMutation.mutate(
      { id: indicatorId, payload: data },
      {
        onSuccess: () => {
          enqueueSnackbar("Berhasil menambahkan realisasi indikator", { variant: "success" });
          handleClose();
        },
        onError: () => {
          enqueueSnackbar("Gagal menambahkan realisasi indikator", { variant: "error" });
        },
      }
    );
  };

  const monthOptions = Array.from({ length: 12 }).map((_, i) => ({
    value: i + 1,
    label: `Bulan ${i + 1}`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Tambah Realisasi Indikator
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <FormDropdownField
              control={control}
              name="month"
              label="Bulan"
              options={monthOptions}
              required
            />
            <FormTextField
              control={control}
              name="realization"
              label="Realisasi"
              type="number"
              required
            />
            <FormTextField
              control={control}
              name="remark"
              label="Catatan"
              multiline
              rows={3}
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

export default ModalAddRealization;
