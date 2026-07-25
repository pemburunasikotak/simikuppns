import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormAutoCompleteField from "@/app/_components/ui/form-auto-complete";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useCreateProgramIndicator from "../_hooks/use-create-program-indicator";
import useUpdateProgramIndicator from "../_hooks/use-update-program-indicator";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";

type ModalAddIndicatorProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  mode: "add" | "edit";
  selectedIndicator: TDefaultProgramIndicator | null;
};

const dropdownSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const schema = z.object({
  unitId: dropdownSchema,
  name: z.string().min(1, "Nama Indikator wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
  targetQ1: z.coerce.number(),
  targetQ2: z.coerce.number(),
  targetQ3: z.coerce.number(),
  targetQ4: z.coerce.number(),
  status: dropdownSchema,
  order: z.coerce.number().min(1, "Urutan minimal 1"),
});

type FormData = z.infer<typeof schema>;

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "DRAFT" },
  { value: "ASSIGNED_TO_UNIT", label: "ASSIGNED TO UNIT" },
  { value: "SUBMITTED", label: "SUBMITTED" },
  { value: "REVISION", label: "REVISION" },
  { value: "APPROVED", label: "APPROVED" },
  { value: "REJECTED", label: "REJECTED" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

const ModalAddIndicator = ({ open, onClose, programId, mode, selectedIndicator }: ModalAddIndicatorProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateProgramIndicator();
  const updateMutation = useUpdateProgramIndicator();
  const { data: unitsData, isLoading: isLoadingUnits } = useGetProkerUnits();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const unitOptions = unitsData?.items.map((unit) => ({
    value: unit.id,
    label: unit.name,
  })) || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      unitId: { value: "", label: "" },
      name: "",
      unit: "",
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
      status: { value: "DRAFT", label: "DRAFT" },
      order: 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && selectedIndicator) {
        reset({
          unitId: selectedIndicator.unitId 
            ? unitOptions.find(u => u.value === selectedIndicator.unitId) || { value: selectedIndicator.unitId, label: "Selected Unit" }
            : { value: "", label: "" },
          name: selectedIndicator.name,
          unit: selectedIndicator.unit,
          targetQ1: selectedIndicator.targetQ1 || 0,
          targetQ2: selectedIndicator.targetQ2 || 0,
          targetQ3: selectedIndicator.targetQ3 || 0,
          targetQ4: selectedIndicator.targetQ4 || 0,
          status: selectedIndicator.status 
            ? STATUS_OPTIONS.find(s => s.value === selectedIndicator.status) || { value: selectedIndicator.status, label: selectedIndicator.status }
            : { value: "DRAFT", label: "DRAFT" },
          order: selectedIndicator.order,
        });
      } else {
        reset({
          unitId: { value: "", label: "" },
          name: "",
          unit: "",
          targetQ1: 0,
          targetQ2: 0,
          targetQ3: 0,
          targetQ4: 0,
          status: { value: "DRAFT", label: "DRAFT" },
          order: 1,
        });
      }
    }
  }, [open, mode, selectedIndicator, reset, unitOptions.length]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      unitId: data.unitId.value,
      name: data.name,
      unit: data.unit,
      targetQ1: data.targetQ1,
      targetQ2: data.targetQ2,
      targetQ3: data.targetQ3,
      targetQ4: data.targetQ4,
      status: data.status.value,
      order: data.order,
    };

    if (mode === "add") {
      createMutation.mutate(
        { programId, payload },
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
      updateMutation.mutate(
        { programId, id: selectedIndicator.id, payload },
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
            <FormAutoCompleteField
              control={control}
              name="unitId"
              label="Pilih Unit"
              placeholder="Pilih Unit"
              options={unitOptions}
              required
            />
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
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormTextField
                  control={control}
                  name="targetQ1"
                  label="Target Q1"
                  type="number"
                  placeholder="0"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormTextField
                  control={control}
                  name="targetQ2"
                  label="Target Q2"
                  type="number"
                  placeholder="0"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormTextField
                  control={control}
                  name="targetQ3"
                  label="Target Q3"
                  type="number"
                  placeholder="0"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormTextField
                  control={control}
                  name="targetQ4"
                  label="Target Q4"
                  type="number"
                  placeholder="0"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormAutoCompleteField
                  control={control}
                  name="status"
                  label="Status"
                  placeholder="Pilih Status"
                  options={STATUS_OPTIONS}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  control={control}
                  name="order"
                  label="Urutan"
                  type="number"
                  placeholder="Contoh: 1"
                  required
                />
              </Grid>
            </Grid>

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
            disabled={isPending || isLoadingUnits}
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

