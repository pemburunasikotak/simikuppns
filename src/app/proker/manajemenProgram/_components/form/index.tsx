import { useEffect } from "react";
import { Button, Grid, Stack, Typography, Box, IconButton } from "@mui/material";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormAutoCompleteField from "@/app/_components/ui/form-auto-complete";

import { defaultProgramSchema, TDefaultProgramFormData } from "./schema";
import useGetListIkuProker from "../../_hooks/use-get-list-iku-proker";

interface Props {
  loading?: boolean;
  handleSubmit: (data: TDefaultProgramFormData) => void;
  defaultValues?: Partial<TDefaultProgramFormData>;
  isEditMode?: boolean;
}

const DefaultProgramForm = ({ loading, handleSubmit, defaultValues, isEditMode }: Props) => {
  const form = useForm<TDefaultProgramFormData>({
    resolver: zodResolver(defaultProgramSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "indicators",
  });

  const [searchParams] = useSearchParams();
  const queryIkuId = searchParams.get("ikuId");

  const { data: ikuData } = useGetListIkuProker({ limit: 50 });
  const ikuOptions =
    ikuData?.data?.items
      ?.filter((iku) => (queryIkuId ? iku.id === queryIkuId : true))
      .map((iku) => ({
        value: iku.id,
        label: `${iku.name}`,
      })) || [];

  useEffect(() => {
    if (queryIkuId && !form.getValues("ikuId")?.value) {
      if (ikuData?.data?.items) {
        const selectedIku = ikuData.data.items.find((i) => i.id === queryIkuId);
        if (selectedIku) {
          form.setValue("ikuId", { value: selectedIku.id, label: selectedIku.name }, { shouldValidate: true });
          form.setValue("ikuCode", selectedIku.code, { shouldValidate: true });
        } else {
          form.setValue("ikuId", { value: queryIkuId, label: "IKU" }, { shouldValidate: true });
          form.setValue("ikuCode", "-", { shouldValidate: true });
        }
      } else {
        form.setValue("ikuId", { value: queryIkuId, label: "IKU" }, { shouldValidate: true });
        form.setValue("ikuCode", "-", { shouldValidate: true });
      }
    }
  }, [queryIkuId, ikuData?.data?.items, form]);

  const selectedIkuItem = useWatch({
    control: form.control,
    name: "ikuId",
  });

  useEffect(() => {
    if (selectedIkuItem?.value && ikuData?.data?.items && !queryIkuId) {
      const selectedIku = ikuData.data.items.find((i) => i.id === selectedIkuItem.value);
      if (selectedIku) {
        form.setValue("ikuCode", selectedIku.code, { shouldValidate: true });
      }
    }
  }, [selectedIkuItem?.value, ikuData?.data?.items, form, queryIkuId]);

  const onSubmit = (data: TDefaultProgramFormData) => {
    const finalIkuId = data.ikuId?.value || form.getValues("ikuId")?.value || queryIkuId;
    const foundIku = ikuData?.data?.items?.find((i) => i.id === finalIkuId);

    // Ambil ikuCode dari ikuData jika ditemukan, jika tidak gunakan yang ada di form
    const finalIkuCode = foundIku?.code || (data.ikuCode !== "-" ? data.ikuCode : undefined) || form.getValues("ikuCode");

    const fullData = {
      ...data,
      ikuId: data.ikuId || form.getValues("ikuId") || (queryIkuId ? { value: queryIkuId, label: foundIku?.name || "IKU" } : undefined),
      ikuCode: finalIkuCode || "-",
    };
    handleSubmit(fullData);
  };

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);



  return (
    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Form Errors:", errors))}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }} sx={{ display: (queryIkuId || isEditMode) ? "none" : "block" }}>
          <FormAutoCompleteField
            label="Pilih IKU"
            control={form.control}
            name="ikuId"
            required={!queryIkuId && !isEditMode}
            placeholder="Pilih IKU"
            options={ikuOptions}
          />
        </Grid>
        <Grid size={{ xs: 12 }} sx={{ display: (queryIkuId || isEditMode) ? "none" : "block" }}>
          <FormTextField
            variant="filled"
            label="Kode IKU"
            control={form.control}
            name="ikuCode"
            required={!queryIkuId && !isEditMode}
            InputProps={{ readOnly: true }}
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
        <Grid size={{ xs: 12 }}>
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

        <Grid size={{ xs: 12 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
            <Typography variant="h6">Indikator Awal (Opsional)</Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => append({ name: "", unit: "", order: fields.length + 1 })}
            >
              Tambah Indikator
            </Button>
          </Box>

          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormTextField
                      variant="filled"
                      label="Nama Indikator"
                      control={form.control}
                      name={`indicators.${index}.name`}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormTextField
                      variant="filled"
                      label="Satuan"
                      control={form.control}
                      name={`indicators.${index}.unit`}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 10, sm: 3 }}>
                    <FormTextField
                      variant="filled"
                      label="Urutan"
                      control={form.control}
                      name={`indicators.${index}.order`}
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 2, sm: 1 }} display="flex" justifyContent="center">
                    <IconButton color="error" onClick={() => remove(index)}>
                      <DeleteOutlined />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {fields.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                Belum ada indikator ditambahkan.
              </Typography>
            )}
          </Stack>
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
