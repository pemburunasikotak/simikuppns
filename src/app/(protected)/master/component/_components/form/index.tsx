import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

import { ComponentSchema, TComponentFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TComponentFormData) => void;
  defaultValues?: Partial<TComponentFormData>;
}

const ComponentForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TComponentFormData>({
    resolver: zodResolver(ComponentSchema),
    mode: "onChange",
  });

  const onSubmit = (data: TComponentFormData) => {
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
            label="Kode Component"
            control={form.control}
            name="code"
            required
            placeholder="Ex: COMP001"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Nama Component"
            control={form.control}
            name="name"
            required
            placeholder="Ex: Component 1"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Deskripsi"
            control={form.control}
            name="description"
            required
            placeholder="Masukkan keterangan component..."
            multiline
            rows={4}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Data Type"
            control={form.control}
            name="dataType"
            required
            options={[
              { value: "number", label: "Number" },
              { value: "percentage", label: "Percentage" },
              { value: "integer", label: "Integer" },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Source Type"
            control={form.control}
            name="sourceType"
            required
            options={[
              { value: "database", label: "Database" },
              { value: "api", label: "API" },
              { value: "manual", label: "Manual" },
            ]}
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

export default ComponentForm;
