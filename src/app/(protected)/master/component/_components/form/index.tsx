import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";

import { IKUSchema, TIKUFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TIKUFormData) => void;
  defaultValues?: Partial<TIKUFormData>;
}

const IKUForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TIKUFormData>({
    resolver: zodResolver(IKUSchema),
    mode: "onChange",
  });

  const onSubmit = (data: TIKUFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Kode IKU"
            control={form.control}
            name="code"
            required
            placeholder="Ex: IKU001"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Nama IKU"
            control={form.control}
            name="name"
            required
            placeholder="Ex: Jumlah Publikasi"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Deskripsi"
            control={form.control}
            name="description"
            required
            placeholder="Masukkan keterangan IKU..."
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: "24px",
        }}
      >
        <Button
          loading={loading}
          type="submit"
          variant="contained"
          sx={{ width: "150px" }}
        >
          Simpan
        </Button>
      </Stack>
    </form>
  );
};

export default IKUForm;
