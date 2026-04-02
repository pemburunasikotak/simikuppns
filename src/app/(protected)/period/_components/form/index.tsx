import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";

import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

import { PeriodSchema, TPeriodFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TPeriodFormData) => void;
  defaultValues?: Partial<TPeriodFormData>;
}

const NumberField = ({
  control,
  name,
  label,
  placeholder,
  required,
}: {
  control: ReturnType<typeof useForm<TPeriodFormData>>["control"];
  name: keyof TPeriodFormData;
  label: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <TextField
        fullWidth
        variant="filled"
        label={label}
        placeholder={placeholder}
        required={required}
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
);

const PeriodForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TPeriodFormData>({
    resolver: zodResolver(PeriodSchema),
    mode: "onChange",
  });

  const onSubmit = (data: TPeriodFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NumberField
            control={form.control}
            name="year"
            label="Tahun"
            placeholder="Ex: 2024"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NumberField
            control={form.control}
            name="periodValue"
            label="Nilai Periode"
            placeholder="Ex: 1"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Tipe Periode"
            control={form.control}
            name="periodType"
            required
            options={[
              { value: "semester", label: "Semester" },
              { value: "quarterly", label: "Triwulan" },
              { value: "monthly", label: "Bulanan" },
              { value: "annual", label: "Tahunan" },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <NumberField
            control={form.control}
            name="level"
            label="Level"
            placeholder="Ex: 1"
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            control={form.control}
            name="periodName"
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                variant="filled"
                label="Nama Periode"
                placeholder="Ex: Semester 1 2024"
                required
                {...field}
                value={field.value ?? ""}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            control={form.control}
            name="parentId"
            render={({ field, fieldState }) => (
              <TextField
                fullWidth
                variant="filled"
                label="Parent ID (Opsional)"
                placeholder="UUID parent periode..."
                {...field}
                value={field.value ?? ""}
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

export default PeriodForm;
