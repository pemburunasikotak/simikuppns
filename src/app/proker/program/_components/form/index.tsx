import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

import { ProgramSchema, TProgramFormData } from "./schema";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";

interface Props {
  loading?: boolean;
  handleSubmit: (data: TProgramFormData) => void;
  defaultValues?: Partial<TProgramFormData>;
}

const ProgramForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TProgramFormData>({
    resolver: zodResolver(ProgramSchema),
    mode: "onChange",
  });

  const { data: unitsData } = useGetProkerUnits();
  const unitOptions = unitsData?.items.map((u) => ({ value: u.id, label: u.name })) || [];

  const onSubmit = (data: TProgramFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log('Form Errors:', errors))}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Kode Program"
            control={form.control}
            name="code"
            required
            placeholder="Ex: 001"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Judul Program"
            control={form.control}
            name="title"
            required
            placeholder="Ex: Program Penelitian Terapan"
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
          <FormTextField
            variant="filled"
            label="Objektif"
            control={form.control}
            name="objective"
            placeholder="Masukkan objektif program..."
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            variant="filled"
            label="Tahun"
            control={form.control}
            name="year"
            type="number"
            placeholder="Ex: 2025"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            variant="filled"
            label="Anggaran (Rp)"
            control={form.control}
            name="budget"
            type="number"
            placeholder="Ex: 50000000"
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Unit ID"
            control={form.control}
            name="unitId"
            required
            placeholder="Pilih Unit"
            options={unitOptions}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            variant="filled"
            label="Kategori ID"
            control={form.control}
            name="categoryId"
            required
            placeholder="Masukkan ID Kategori"
          />
        </Grid> */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDropdownField
            label="Status"
            control={form.control}
            name="status"
            options={[
              { value: "DRAFT", label: "DRAFT" },
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "COMPLETED", label: "COMPLETED" },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            variant="filled"
            label="PIC ID"
            control={form.control}
            name="picId"
            placeholder="Masukkan ID PIC"
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

export default ProgramForm;
