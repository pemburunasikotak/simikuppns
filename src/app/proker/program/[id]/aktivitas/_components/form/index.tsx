import { useEffect } from "react";
import { Button, Grid, Card, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/app/_components/ui/form-text-field";
import { ActivitySchema, TActivityFormData } from "./schema";

interface Props {
  loading?: boolean;
  handleSubmit: (data: TActivityFormData) => void;
  defaultValues?: Partial<TActivityFormData>;
  onCancel?: () => void;
}

const AktivitasForm = ({ loading, handleSubmit, defaultValues, onCancel }: Props) => {
  const form = useForm<TActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    mode: "onChange",
    defaultValues: {
      weight: 0,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as TActivityFormData);
    }
  }, [defaultValues, form]);

  const onSubmit = (data: TActivityFormData) => {
    handleSubmit(data);
  };

  return (
    <Card sx={{ p: 3 }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormTextField
              variant="filled"
              label="Judul Aktivitas"
              control={form.control}
              name="title"
              required
              placeholder="Ex: Workshop Pelatihan"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextField
              variant="filled"
              label="Deskripsi"
              control={form.control}
              name="description"
              placeholder="Masukkan keterangan aktivitas..."
              multiline
              rows={4}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextField
              variant="filled"
              label="Bobot (%)"
              control={form.control}
              name="weight"
              type="number"
              required
              placeholder="Ex: 25"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField
              variant="filled"
              label="Tanggal Mulai"
              control={form.control}
              name="startDate"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormTextField
              variant="filled"
              label="Tanggal Selesai"
              control={form.control}
              name="endDate"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          {onCancel && (
            <Button onClick={onCancel} variant="outlined" disabled={loading}>
              Batal
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default AktivitasForm;
