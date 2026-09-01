import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  FormGroup,
  FormLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import FormUploadField from "@/app/_components/ui/form-upload-field";
import BaseInputText from "@/app/_components/ui/base-input-text";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useSetProgramIndicatorTarget from "../../_hooks/use-set-program-indicator-target";
import useGetUnitUsers from "@/app/proker/unit/_hooks/use-get-unit-users";
import { uploadProkerDocument } from "@/api/proker/program/api";

type ModalSetTargetProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  selectedIndicator: TDefaultProgramIndicator | null;
};

const schema = z.object({
  category: z.string().optional(),
  targetQ1: z.coerce.number().min(0, "Target Q1 minimal 0"),
  targetQ2: z.coerce.number().min(0, "Target Q2 minimal 0"),
  targetQ3: z.coerce.number().min(0, "Target Q3 minimal 0"),
  targetQ4: z.coerce.number().min(0, "Target Q4 minimal 0"),
  budget: z.string().optional(),
  propsal: z.any().optional(),
  rab: z.any().optional(),
  picIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const ModalSetTarget = ({ open, onClose, programId, selectedIndicator }: ModalSetTargetProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const setTargetMutation = useSetProgramIndicatorTarget(programId);

  const [isUploading, setIsUploading] = useState(false);
  const isPending = setTargetMutation.isPending || isUploading;

  const { data: usersData } = useGetUnitUsers(selectedIndicator?.unitId || "", { limit: 50 });
  const picOptions = usersData?.data?.items?.map((user: { id: string; name: string }) => ({
    value: user.id,
    label: user.name,
  })) || [];

  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "",
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
      budget: "",
      propsal: "",
      rab: "",
      picIds: [],
    },
  });

  const categoryValue = watch("category") || selectedIndicator?.category || "";
  const showBudgetAndFiles = categoryValue === "RUTIN" || categoryValue === "PENGEMBANGAN";

  useEffect(() => {
    if (open && selectedIndicator) {
      reset({
        category: selectedIndicator.category || "",
        targetQ1: selectedIndicator.targetQ1 || 0,
        targetQ2: selectedIndicator.targetQ2 || 0,
        targetQ3: selectedIndicator.targetQ3 || 0,
        targetQ4: selectedIndicator.targetQ4 || 0,
        budget: ((selectedIndicator as unknown) as { budget?: string }).budget || "",
        propsal: ((selectedIndicator as unknown) as { propsal?: string }).propsal || "",
        rab: ((selectedIndicator as unknown) as { rab?: string }).rab || "",
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

  const onSubmit = async (data: FormData) => {
    if (!selectedIndicator) return;

    const currentCat = data.category || selectedIndicator.category || "";
    const isRutinOrPengembangan = currentCat === "RUTIN" || currentCat === "PENGEMBANGAN";
    const numericBudget = isRutinOrPengembangan && data.budget ? data.budget.replace(/[^0-9]/g, "") : "0";

    let proposalVal = data.propsal;
    let rabVal = data.rab;

    if (isRutinOrPengembangan) {
      if (data.propsal instanceof File) {
        setIsUploading(true);
        try {
          proposalVal = await uploadProkerDocument(data.propsal, "PROPOSAL");
        } catch {
          enqueueSnackbar("Gagal mengunggah berkas Proposal/TOR", { variant: "error" });
          setIsUploading(false);
          return;
        }
      }
      if (data.rab instanceof File) {
        setIsUploading(true);
        try {
          rabVal = await uploadProkerDocument(data.rab, "RAB");
        } catch {
          enqueueSnackbar("Gagal mengunggah berkas RAB", { variant: "error" });
          setIsUploading(false);
          return;
        }
      }
    }
    setIsUploading(false);

    const payload: import("@/api/proker/program/type").TSetProgramIndicatorTargetPayload = {
      targetQ1: Number(data.targetQ1),
      targetQ2: Number(data.targetQ2),
      targetQ3: Number(data.targetQ3),
      targetQ4: Number(data.targetQ4),
      budget: numericBudget,
      picIds: data.picIds || [],
      pics: usersData?.data?.items?.filter((u: { id: string }) => data.picIds.includes(u.id)) || [],
      ...(isRutinOrPengembangan ? { propsal: proposalVal, rab: rabVal } : {}),
    };

    setTargetMutation.mutate(
      { id: selectedIndicator.id, payload },
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Assign / Set Target Indikator
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                control={control}
                name="category"
                label="Kategori"
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDropdownCheckboxField
                control={control}
                name="picIds"
                label="PIC"
                options={picOptions}
                required
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ1"
                label="Target Q1"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ2"
                label="Target Q2"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ3"
                label="Target Q3"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ4"
                label="Target Q4"
                type="number"
                required
              />
            </Grid>

            {showBudgetAndFiles && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="budget"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl variant="standard" sx={{ width: "100%" }}>
                        <FormLabel htmlFor="budget" error={fieldState.invalid} required>
                          Budget
                        </FormLabel>
                        <FormGroup>
                          <BaseInputText
                            id="budget"
                            variant="outlined"
                            value={field.value}
                            placeholder="Contoh: 10.000.000"
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                            onChange={(e) => {
                              const formatted = formatRupiah(e.target.value);
                              field.onChange(formatted);
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                                    Rp
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </FormGroup>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="propsal"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormUploadField
                        label="TOR"
                        name="propsal"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                        error={!!error}
                        helper={error?.message}
                        acceptFormat=".pdf,.doc,.docx"
                        uploadDesc="Format Dokumen PDF, DOCX"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="rab"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormUploadField
                        label="RAB"
                        name="rab"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                        error={!!error}
                        helper={error?.message}
                        acceptFormat=".pdf,.xls,.xlsx"
                        uploadDesc="Format Dokumen PDF, XLSX"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ fontStyle: "italic", display: "block", mt: 0.5 }}
                  >
                    * Lampirkan pengusulan terkait bahan habis pakai, peralatan, mebel, dan perawatan-perbaikan.
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
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
