import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormAutoCompleteField from "@/app/_components/ui/form-auto-complete";

import { defaultProgramSchema, TDefaultProgramFormData } from "./schema";
import useGetListIkuProker from "../../_hooks/use-get-list-iku-proker";

interface Props {
  loading?: boolean;
  handleSubmit: (data: TDefaultProgramFormData) => void;
  defaultValues?: Partial<TDefaultProgramFormData>;
}

const DefaultProgramForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TDefaultProgramFormData>({
    resolver: zodResolver(defaultProgramSchema),
    mode: "onChange",
  });

  const { data: ikuData } = useGetListIkuProker({ limit: 50 });
  const ikuOptions =
    ikuData?.data?.items?.map((iku) => ({
      value: iku.id,
      label: `${iku.name}`,
    })) || [];

  const onSubmit = (data: TDefaultProgramFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const selectedIkuItem = useWatch({
    control: form.control,
    name: "ikuId",
  });

  useEffect(() => {
    if (selectedIkuItem?.value && ikuData?.data?.items) {
      const selectedIku = ikuData.data.items.find((i) => i.id === selectedIkuItem.value);
      if (selectedIku) {
        form.setValue("ikuCode", selectedIku.code, { shouldValidate: true });
      }
    }
  }, [selectedIkuItem?.value, ikuData?.data?.items, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Form Errors:", errors))}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormAutoCompleteField
            label="Pilih IKU"
            control={form.control}
            name="ikuId"
            required
            placeholder="Pilih IKU"
            options={ikuOptions}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Kode IKU"
            control={form.control}
            name="ikuCode"
            required
            disabled
            placeholder="Otomatis terisi setelah memilih IKU"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Judul Program"
            control={form.control}
            name="title"
            required
            placeholder="Ex: Program Peningkatan Mutu"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormTextField
            variant="filled"
            label="Deskripsi"
            control={form.control}
            name="description"
            placeholder="Masukkan keterangan program..."
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

export default DefaultProgramForm;
