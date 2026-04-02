import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";

import FormTextField from "@/app/_components/ui/form-text-field";

import { ComponentRealizationSchema, TComponentRealizationFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TComponentRealizationFormData) => void;
  defaultValues?: Partial<TComponentRealizationFormData>;
}

const ComponentRealizationForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TComponentRealizationFormData>({
    resolver: zodResolver(ComponentRealizationSchema),
    mode: "onChange",
  });

  const onSubmit = (data: TComponentRealizationFormData) => {
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
            label="ID Komponen"
            control={form.control}
            name="idComponent"
            required
            placeholder="Masukkan ID komponen..."
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="ID Periode"
            control={form.control}
            name="idPeriod"
            required
            placeholder="Masukkan ID periode..."
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                variant="filled"
                label="Nilai Realisasi"
                placeholder="Masukkan nilai realisasi..."
                required
                type="number"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? undefined : Number(val));
                }}
                onBlur={field.onBlur}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ mt: "24px" }}
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

export default ComponentRealizationForm;
