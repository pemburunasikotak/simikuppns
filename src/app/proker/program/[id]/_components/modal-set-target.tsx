import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useSetProgramIndicatorTarget from "../../_hooks/use-set-program-indicator-target";
import useGetIndicatorUsers from "../_hooks/use-get-indicator-users";

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
  budget: z.string().min(1, "Budget wajib diisi"),
  // picIds: z.array(z.string()).min(1, "PIC wajib dipilih"),
  picIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const ModalSetTarget = ({ open, onClose, programId, selectedIndicator }: ModalSetTargetProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setTargetMutation = useSetProgramIndicatorTarget(programId);

  const isPending = setTargetMutation.isPending;

  const { data: usersData } = useGetIndicatorUsers(programId, selectedIndicator?.id || "", { limit: 10, page: 1 });
  const picOptions = usersData?.data?.items?.map((user: { id: string; name: string }) => ({
    value: user.id,
    label: user.name,
  })) || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
      budget: "",
      picIds: [],
    },
  });

  useEffect(() => {
    if (open && selectedIndicator) {
      reset({
        targetQ1: selectedIndicator.targetQ1 || 0,
        targetQ2: selectedIndicator.targetQ2 || 0,
        targetQ3: selectedIndicator.targetQ3 || 0,
        targetQ4: selectedIndicator.targetQ4 || 0,
        budget: ((selectedIndicator as unknown) as { budget?: string }).budget || "",
        picIds: ((selectedIndicator as unknown) as { picIds?: string[] }).picIds || [],
      });
    }
  }, [open, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  };

  const onSubmit = (data: FormData) => {
    if (!selectedIndicator) return;

    // Clean up budget to only numeric string for payload if needed, 
    // but user said "dikirim dalam bentuk string". Let's assume numeric string.
    const numericBudget = data.budget.replace(/[^0-9]/g, "");

    const payload = {
      ...data,
      budget: numericBudget,
      pics: usersData?.data?.items?.filter((u: { id: string }) => data.picIds.includes(u.id)) || [],
    };

    setTargetMutation.mutate(
      { id: selectedIndicator.id, payload: payload as import("@/api/proker/program/type").TSetProgramIndicatorTargetPayload },
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
            <Controller
              name="budget"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Budget"
                  variant="outlined"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  required
                  onChange={(e) => {
                    const formatted = formatRupiah(e.target.value);
                    field.onChange(formatted);
                  }}
                  InputProps={{
                    startAdornment: <div style={{ marginRight: 8, marginTop: 1 }}>Rp</div>,
                  }}
                />
              )}
            />
            <FormDropdownCheckboxField
              control={control}
              name="picIds"
              label="PIC"
              options={picOptions}
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
