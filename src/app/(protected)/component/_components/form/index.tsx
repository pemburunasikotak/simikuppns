import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";

import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

import { ComponentRealizationSchema, TComponentRealizationFormData } from "./schema";
import { useQuery } from "@/app/_hooks/request/use-query";
import { getListComponent } from "@/api/master/component";
import { getListPeriod } from "@/api/period";
import { queryKeys } from "@/commons/constants/query-key";

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

  // Fetch components for dropdown
  const componentQuery = useQuery({
    queryKey: [queryKeys.masterData.component.list, { limit: 999 }],
    queryFn: () => getListComponent({ limit: 999, order: "ASC" }),
  });

  // Fetch periods for dropdown
  const periodQuery = useQuery({
    queryKey: [queryKeys.period.list, { limit: 999 }],
    queryFn: () => getListPeriod({ limit: 999, order: "ASC" }),
  });

  const componentOptions = (componentQuery.data?.result?.data ?? []).map((c) => ({
    value: c.id,
    label: `${c.code} - ${c.name}`,
  }));

  const periodOptions = (periodQuery.data?.result?.data ?? []).map((p) => ({
    value: p.idPeriod,
    label: p.periodName,
  }));

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
          <FormDropdownField
            label="Komponen"
            control={form.control}
            name="idComponent"
            required
            placeholder="Pilih Komponen..."
            options={componentOptions}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormDropdownField
            label="Periode"
            control={form.control}
            name="idPeriod"
            required
            placeholder="Pilih Periode..."
            options={periodOptions}
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
