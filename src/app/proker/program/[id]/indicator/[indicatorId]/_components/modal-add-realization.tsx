import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import FormUploadMultipleField from "@/app/_components/ui/form-upload-multipel-field";
import useAddIndicatorRealization from "../../../../_hooks/use-add-indicator-realization";
import { uploadProkerDocuments } from "@/api/proker/program/api";

type ModalAddRealizationProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  indicatorId: string | null;
  unitType?: string;
};

const schema = z.object({
  month: z.coerce.number().min(1).max(12),
  realization: z.union([z.string(), z.number()]).optional(),
  remark: z.string().min(1, "Catatan wajib diisi"),
});

type FormData = z.infer<typeof schema>;

const ModalAddRealization = ({
  open,
  onClose,
  programId,
  indicatorId,
  unitType = "NUMBER",
}: ModalAddRealizationProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const addRealizationMutation = useAddIndicatorRealization(programId);

  const [isUploading, setIsUploading] = useState(false);
  const isPending = addRealizationMutation.isPending || isUploading;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const normalizedType = (unitType || "NUMBER").toUpperCase();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      realization: normalizedType === "NUMBER" ? 0 : "",
      remark: "",
    },
  });

  useEffect(() => {
    if (open && indicatorId) {
      reset({
        month: new Date().getMonth() + 1,
        realization: normalizedType === "NUMBER" ? 0 : "",
        remark: "",
      });
      setSelectedFiles([]);
      setFilePreviews([]);
    }
  }, [open, indicatorId, reset, normalizedType]);

  const handleClose = () => {
    reset();
    setSelectedFiles([]);
    setFilePreviews([]);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setFilePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (!indicatorId) return;

    if (normalizedType === "FILE" && selectedFiles.length === 0) {
      enqueueSnackbar("Silakan unggah setidaknya satu berkas", { variant: "warning" });
      return;
    }

    if (normalizedType === "NUMBER" && (data.realization === undefined || data.realization === "")) {
      enqueueSnackbar("Realisasi wajib diisi", { variant: "warning" });
      return;
    }

    if (normalizedType === "TEXT" && (!data.realization || String(data.realization).trim() === "")) {
      enqueueSnackbar("Realisasi wajib diisi", { variant: "warning" });
      return;
    }

    const realizationVal = normalizedType === "FILE" 
      ? selectedFiles.length 
      : data.realization;

    let documentIds: string[] = [];

    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        documentIds = await uploadProkerDocuments(selectedFiles, "EVIDENCE");
      } catch {
        enqueueSnackbar("Gagal mengunggah berkas", { variant: "error" });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    addRealizationMutation.mutate(
      {
        id: indicatorId,
        payload: {
          month: Number(data.month),
          realization: Number(realizationVal) || 0,
          remark: data.remark,
          documentIds,
        },
      },
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

            {normalizedType === "NUMBER" && (
              <FormTextField
                control={control}
                name="realization"
                label="Realisasi"
                type="number"
                required
                placeholder="Masukkan angka realisasi"
              />
            )}

            {normalizedType === "TEXT" && (
              <FormTextField
                control={control}
                name="realization"
                label="Realisasi"
                multiline
                rows={3}
                required
                placeholder="Masukkan deskripsi realisasi"
              />
            )}

            <FormUploadMultipleField
              label={normalizedType === "FILE" ? "Upload File Realisasi" : "Upload File / Bukti Pendukung"}
              name="files"
              onChange={handleFileChange}
              value={filePreviews}
              onRemove={handleRemoveFile}
              required={normalizedType === "FILE"}
              acceptFormat=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              uploadDesc="Format File PDF, Gambar, Word, Excel. Maksimal 10 MB"
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
