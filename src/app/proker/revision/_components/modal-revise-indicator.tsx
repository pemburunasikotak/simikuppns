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
  Alert,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormUploadField from "@/app/_components/ui/form-upload-field";
import BaseInputText from "@/app/_components/ui/base-input-text";
import { uploadProkerDocument } from "@/api/proker/program/api";
import { TRevisionIndicatorItem } from "@/api/proker/revision/type";
import { useReviseIndicator } from "../_hooks/use-revise-indicator";

type ModalReviseIndicatorProps = {
  open: boolean;
  onClose: () => void;
  indicator: TRevisionIndicatorItem | null;
};

const schema = z.object({
  targetQ1: z.coerce.number().min(0, "Target Q1 minimal 0"),
  targetQ2: z.coerce.number().min(0, "Target Q2 minimal 0"),
  targetQ3: z.coerce.number().min(0, "Target Q3 minimal 0"),
  targetQ4: z.coerce.number().min(0, "Target Q4 minimal 0"),
  budget: z.string().optional(),
  propsal: z.any().optional(),
  rab: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const formatRupiah = (value: string | number = "") => {
  const stringVal = String(value);
  const numberString = stringVal.replace(/[^,\d]/g, "").toString();
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

export default function ModalReviseIndicator({
  open,
  onClose,
  indicator,
}: ModalReviseIndicatorProps) {
  const { enqueueSnackbar } = useSnackbar();
  const reviseMutation = useReviseIndicator();

  const [isUploading, setIsUploading] = useState(false);
  const isPending = reviseMutation.isPending || isUploading;

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
      budget: "",
      propsal: "",
      rab: "",
    },
  });

  useEffect(() => {
    if (open && indicator) {
      reset({
        targetQ1: indicator.targetQ1 || 0,
        targetQ2: indicator.targetQ2 || 0,
        targetQ3: indicator.targetQ3 || 0,
        targetQ4: indicator.targetQ4 || 0,
        budget: indicator.budget ? formatRupiah(indicator.budget) : "",
        propsal: indicator.proposalDocumentId || indicator.proposalURL || "",
        rab: indicator.rabDocumentId || indicator.rabURL || "",
      });
    }
  }, [open, indicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (!indicator) return;

    const numericBudget = data.budget ? data.budget.replace(/[^0-9]/g, "") : "0";

    let proposalVal = "";
    let rabVal = "";

    if (data.propsal instanceof File) {
      setIsUploading(true);
      try {
        proposalVal = await uploadProkerDocument(data.propsal, "PROPOSAL");
      } catch {
        enqueueSnackbar("Gagal mengunggah berkas Proposal/TOR", { variant: "error" });
        setIsUploading(false);
        return;
      }
    } else {
      proposalVal =
        indicator.proposalDocumentId ||
        (typeof data.propsal === "string" && data.propsal ? data.propsal : "") ||
        indicator.proposalURL ||
        "";
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
    } else {
      rabVal =
        indicator.rabDocumentId ||
        (typeof data.rab === "string" && data.rab ? data.rab : "") ||
        indicator.rabURL ||
        "";
    }

    setIsUploading(false);

    const payload = {
      targetQ1: Number(data.targetQ1),
      targetQ2: Number(data.targetQ2),
      targetQ3: Number(data.targetQ3),
      targetQ4: Number(data.targetQ4),
      budget: numericBudget,
      propsal: proposalVal || "",
      rab: rabVal || "",
      proposalDocumentId: proposalVal || "",
      rabDocumentId: rabVal || "",
    };

    reviseMutation.mutate(
      { id: indicator.id, payload },
      {
        onSuccess: (res) => {
          enqueueSnackbar(res?.message || "Revisi indikator berhasil dikirim", {
            variant: "success",
          });
          handleClose();
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          enqueueSnackbar(
            error?.response?.data?.message || "Gagal mengembalikan revisi indikator",
            { variant: "error" }
          );
        },
      }
    );
  };

  const getLevelLabel = (level?: string) => {
    if (level === "INDICATOR_VERIFICATION") return "Verifikasi Indikator";
    if (level === "BUDGET_VERIFICATION") return "Verifikasi Anggaran";
    return level || "Verifikasi";
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>
        Perbaiki / Resubmit Revisi Indikator
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {indicator && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                {indicator.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Program: {indicator.program?.title || "-"} | Unit: {indicator.unit?.name || "-"}
              </Typography>

              {indicator.revisionNote && (
                <Alert severity="warning" sx={{ mt: 1.5, borderRadius: "8px" }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Catatan Revisi ({getLevelLabel(indicator.revisionLevel)}):
                  </Typography>
                  <Typography variant="body2">{indicator.revisionNote}</Typography>
                </Alert>
              )}
            </Box>
          )}

          <Grid container spacing={2.5}>
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

            <Grid size={{ xs: 12 }}>
              <Controller
                name="budget"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <FormLabel htmlFor="budget" error={fieldState.invalid}>
                      Anggaran / Budget
                    </FormLabel>
                    <FormGroup>
                      <BaseInputText
                        id="budget"
                        variant="outlined"
                        value={field.value}
                        placeholder="Contoh: 15.000.000"
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
                    label="TOR / Proposal"
                    name="propsal"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    value={
                      value && typeof value === "object"
                        ? (value as File).name
                        : (value as string) || ""
                    }
                    error={!!error}
                    helper={error?.message}
                    acceptFormat=".pdf,.doc,.docx"
                    uploadDesc="Format Dokumen PDF, DOCX"
                    templateType="TOR"
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
                    value={
                      value && typeof value === "object"
                        ? (value as File).name
                        : (value as string) || ""
                    }
                    error={!!error}
                    helper={error?.message}
                    acceptFormat=".xls,.xlsx"
                    uploadDesc="Format Dokumen XLS, XLSX"
                    templateType="RAB"
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
            {isPending ? "Menyimpan..." : "Kirim Revisi"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
