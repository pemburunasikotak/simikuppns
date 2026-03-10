import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormAutoCompleteField from "@/app/_components/ui/form-auto-complete";

import { FacilitiesSchema, TFacilitiesFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TFacilitiesFormData) => void;
  defaultValues?: Partial<TFacilitiesFormData>;
}

const FacilitiesForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TFacilitiesFormData>({
    resolver: zodResolver(FacilitiesSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
    });
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            variant="filled"
            label="Nama Fasilitas"
            control={form.control}
            name="name"
            required
            placeholder="Ex: Aula Utama"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormAutoCompleteField
            control={form.control}
            label="Tipe Fasilitas"
            name="type"
            defaultValue={defaultValues?.type}
            placeholder="Pilih Fasilitas"
            handleSearch={() => { }}
            options={[
              {
                value: "A",
                label: "Rekreasi",
              },
              {
                value: "B",
                label: "Olahraga",
              },
              {
                value: "D",
                label: "Fasilitas Sosial",
              },
            ]}
            required
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
        <Button loading={loading} type="submit" variant="contained">
          Simpan
        </Button>
      </Stack>
    </form>
  );
};

export default FacilitiesForm;
