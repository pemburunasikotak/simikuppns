import { useEffect } from "react";
import { Button, Grid, Stack, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";
import HelperText from "@/app/_components/ui/helper-text";

import { IKUSchema, TIKUFormData } from "./schema";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TIKUFormData) => void;
  defaultValues?: Partial<TIKUFormData>;
}

const IKUForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TIKUFormData>({
    resolver: zodResolver(IKUSchema) as unknown as Resolver<TIKUFormData>,
    mode: "onChange",
  });

  const onSubmit = (data: TIKUFormData) => {
    handleSubmit(data);
  };

  useEffect(() => {
    form.reset({
      isDirectInput: false,
      ...defaultValues,
    });
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
        <Grid size={{ xs: 12 }}>
          <FormControl component="fieldset" error={!!form.formState.errors.isDirectInput}>
            <FormLabel 
              required 
              sx={{ 
                mb: 1, 
                fontSize: "14px", 
                fontWeight: 500, 
                color: "#344054" 
              }}
            >
              Direct Input
            </FormLabel>
            <Controller
              name="isDirectInput"
              control={form.control}
              render={({ field }) => (
                <RadioGroup
                  row
                  value={field.value === true ? "true" : field.value === false ? "false" : ""}
                  onChange={(e) => field.onChange(e.target.value === "true")}
                >
                  <FormControlLabel 
                    value="true" 
                    control={<Radio size="small" />} 
                    label="Ya" 
                  />
                  <FormControlLabel 
                    value="false" 
                    control={<Radio size="small" />} 
                    label="Tidak" 
                  />
                </RadioGroup>
              )}
            />
            {form.formState.errors.isDirectInput ? (
              <HelperText>{form.formState.errors.isDirectInput.message}</HelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormDropdownField
            label="Unit"
            control={form.control}
            name="unit"
            required
            options={[
              { value: "percentage", label: "Persen" },
              { value: "number", label: "Angka" },
              { value: "file", label: "File" },
              { value: "text", label: "Text" },
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

export default IKUForm;
