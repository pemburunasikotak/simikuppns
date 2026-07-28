import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useCreateDefaultProgramIndicator from "../_hooks/use-create-default-program-indicator";
import useUpdateProgramIndicator from "../_hooks/use-update-program-indicator";

type ModalAddIndicatorProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  mode: "add" | "edit";
  selectedIndicator: TDefaultProgramIndicator | null;
};

const schema = z.object({
  name: z.string().min(1, "Nama Indikator wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  order: z.coerce.number().min(1, "Urutan minimal 1"),
});

type FormData = z.infer<typeof schema>;

const ModalAddIndicator = ({ open, onClose, programId, mode, selectedIndicator }: ModalAddIndicatorProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateDefaultProgramIndicator();
  const updateMutation = useUpdateProgramIndicator();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      unit: "",
      order: 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && selectedIndicator) {
        reset({
          name: selectedIndicator.name,
          unit: typeof selectedIndicator.unit === 'string' ? selectedIndicator.unit : selectedIndicator.unit?.name || "",
          order: selectedIndicator.order,
        });
      } else {
        reset({
          name: "",
          unit: "",
          order: 1,
        });
      }
    }
  }, [open, mode, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    const basePayload = {
      name: data.name,
      unit: data.unit,
      order: data.order,
    };

    if (mode === "add") {
      createMutation.mutate(
        { id: programId, payload: basePayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil menambahkan indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal menambahkan indikator", { variant: "error" });
          },
        }
      );
    } else {
      if (!selectedIndicator) return;
      const updatePayload = {
        ...basePayload,
        unitId: selectedIndicator.unitId || "",
        targetQ1: selectedIndicator.targetQ1 || 0,
        targetQ2: selectedIndicator.targetQ2 || 0,
        targetQ3: selectedIndicator.targetQ3 || 0,
        targetQ4: selectedIndicator.targetQ4 || 0,
        status: selectedIndicator.status || "DRAFT",
      };
      updateMutation.mutate(
        { programId, id: selectedIndicator.id, payload: updatePayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil mengubah indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal mengubah indikator", { variant: "error" });
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "add" ? "Tambah Indikator" : "Ubah Indikator"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <FormTextField
              control={control}
              name="name"
              label="Nama Indikator"
              placeholder="Contoh: Jumlah Publikasi"
              required
            />
            <FormTextField
              control={control}
              name="unit"
              label="Satuan"
              placeholder="Contoh: Dokumen, Orang, %"
              required
            />
            {/* <FormTextField
              control={control}
              name="order"
              label="Urutan"
              type="number"
              placeholder="Contoh: 1"
              required
            /> */}
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

export default ModalAddIndicator;

