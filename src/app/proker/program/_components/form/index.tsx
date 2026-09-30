import { useEffect } from "react";
import { Button, Grid, Stack, FormControl, FormGroup, FormLabel, Box, Typography, Divider, IconButton, InputAdornment } from "@mui/material";
import { useForm, Controller, useFieldArray, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";

import FormTextField from "@/app/_components/ui/form-text-field";
import BaseInputText from "@/app/_components/ui/base-input-text";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import FormUploadField from "@/app/_components/ui/form-upload-field";

import { ProgramSchema, TProgramFormData } from "./schema";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";
import useGetMyUnits from "@/app/proker/unit/_hooks/use-get-my-units";
import useGetUnitUsers from "@/app/proker/unit/_hooks/use-get-unit-users";
import { useGetProkerMasterUnits } from "@/app/proker/master-unit/_hooks/use-get-master-units";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";
import useGetListIKU from "@/app/proker/unit/[id]/_hooks/use-get-list-iku";

const formatRupiah = (value: string) => {
  const numberString = value.replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
};

const IndicatorItem = ({
  item,
  index,
  control,
  remove,
  unitOptions,
  masterUnitOptions,
}: {
  item: { id: string } & Record<string, unknown>;
  index: number;
  control: Control<TProgramFormData>;
  remove: (index: number) => void;
  unitOptions: { value: string; label: string }[];
  masterUnitOptions: { value: string; label: string }[];
}) => {
  const selectedUnitId = useWatch({ control, name: `indicators.${index}.unitId` });
  const { data: usersData } = useGetUnitUsers(selectedUnitId, { limit: 50 });
  const picOptions =
    usersData?.data?.items?.map((user: { id: string; name: string }) => ({
      value: user.id,
      label: user.name,
    })) || [];

  const category = useWatch({ control, name: `indicators.${index}.category` });
  const showBudgetAndFiles = category === "RUTIN" || category === "PENGEMBANGAN";

  return (
    <Box key={item.id} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">Indikator {index + 1}</Typography>
        <IconButton color="error" onClick={() => remove(index)}>
          <DeleteOutlined />
        </IconButton>
      </Stack>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            control={control}
            name={`indicators.${index}.name`}
            label="Nama Indikator"
            placeholder="Contoh: Jumlah Publikasi"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Kategori"
            control={control}
            name={`indicators.${index}.category`}
            options={[
              { value: "TUSI", label: "TUSI" },
              { value: "RUTIN", label: "RUTIN" },
              { value: "PENGEMBANGAN", label: "PENGEMBANGAN" },
            ]}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            control={control}
            name={`indicators.${index}.unitId`}
            label="UNIT"
            options={unitOptions}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            control={control}
            name={`indicators.${index}.masterUnitTypeId`}
            label="Satuan"
            options={masterUnitOptions}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: showBudgetAndFiles ? 6 : 12 }}>
          <FormDropdownCheckboxField
            control={control}
            name={`indicators.${index}.picIds`}
            label="PIC"
            options={picOptions}
          />
        </Grid>

        {showBudgetAndFiles && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name={`indicators.${index}.budget`}
              control={control}
              render={({ field, fieldState }) => (
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <FormLabel htmlFor={`budget-${index}`} error={fieldState.invalid} required>
                    Budget
                  </FormLabel>
                  <FormGroup>
                    <BaseInputText
                      id={`budget-${index}`}
                      variant="outlined"
                      value={field.value}
                      placeholder="Contoh: 10.000.000"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      onChange={(e) => {
                        const formatted = formatRupiah(e.target.value);
                        field.onChange(formatted);
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                              Rp
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormGroup>
                </FormControl>
              )}
            />
          </Grid>
        )}

        <Grid size={{ xs: 6, sm: 3 }}>
          <FormTextField
            control={control}
            name={`indicators.${index}.targetQ1`}
            label="Target Q1"
            type="number"
            required
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <FormTextField
            control={control}
            name={`indicators.${index}.targetQ2`}
            label="Target Q2"
            type="number"
            required
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <FormTextField
            control={control}
            name={`indicators.${index}.targetQ3`}
            label="Target Q3"
            type="number"
            required
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <FormTextField
            control={control}
            name={`indicators.${index}.targetQ4`}
            label="Target Q4"
            type="number"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <FormTextField
            variant="outlined"
            label="Order"
            type="number"
            control={control}
            name={`indicators.${index}.order`}
          />
        </Grid>

        {showBudgetAndFiles && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`indicators.${index}.propsal`}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FormUploadField
                    label="TOR"
                    name={`indicators.${index}.propsal`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                    error={!!error}
                    helper={error?.message}
                    acceptFormat=".pdf,.doc,.docx"
                    uploadDesc="Format Dokumen PDF, DOCX"
                    templateType="TOR"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={`indicators.${index}.rab`}
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <FormUploadField
                    label="RAB"
                    name={`indicators.${index}.rab`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                    error={!!error}
                    helper={error?.message}
                    acceptFormat=".xls,.xlsx"
                    uploadDesc="Format Dokumen XLS, XLSX"
                    templateType="RAB"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                variant="caption"
                color="error"
                sx={{ fontStyle: "italic", display: "block", mt: 0.5 }}
              >
                * Lampirkan pengusulan terkait bahan habis pakai, peralatan, mebel, dan perawatan-perbaikan.
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "indicators",
  });

  const user = ProkerSessionUser.get()?.user;
  const userRoleKeys = user?.roles?.map((r: { key: string }) => r.key) || [];
  const isAdmin = userRoleKeys.includes("admin_sim_proker");

  const { data: unitsData } = useGetProkerUnits();
  const { data: myUnitsData } = useGetMyUnits({ limit: 50 });

  const allUnitOptions = unitsData?.items.map((u) => ({ value: u.id, label: u.name })) || [];
  const myUnitOptions = myUnitsData?.map((item) => ({
    value: item?.unit?.id || item?.id || "",
    label: item?.unit?.name || item?.name || "",
  })) || [];

  const unitOptions = isAdmin ? allUnitOptions : myUnitOptions;

  const { data: masterUnitTypesData } = useGetProkerMasterUnits({ limit: 50 });
  const masterUnitOptions = masterUnitTypesData?.items?.map(unit => ({ value: unit.id, label: unit.name })) || [];

  const allIKUsQuery = useGetListIKU({ limit: 100, page: 1 });
  const extractArray = (res: unknown): Record<string, unknown>[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res as Record<string, unknown>[];
    if (typeof res === "object") {
      const r = res as Record<string, unknown>;
      if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
      if (r.data && typeof r.data === "object") {
        const d = r.data as Record<string, unknown>;
        if (Array.isArray(d.data)) return d.data as Record<string, unknown>[];
        if (Array.isArray(d.items)) return d.items as Record<string, unknown>[];
      }
      if (Array.isArray(r.items)) return r.items as Record<string, unknown>[];
    }
    return [];
  };
  const allIKUs = extractArray(allIKUsQuery.data);
  const ikuOptions = allIKUs.map((iku) => ({ value: String(iku.id), label: `${iku.code ? String(iku.code) + ' - ' : ''}${String(iku.name)}` }));

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
          <Controller
            control={form.control}
            name="budget"
            render={({ field, fieldState }) => (
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <FormLabel htmlFor={field.name} error={fieldState.invalid}>
                    Anggaran (Rp)
                  </FormLabel>
                </div>
                <FormGroup>
                  <BaseInputText
                    variant="filled"
                    id={field.name}
                    value={
                      field.value
                        ? new Intl.NumberFormat("id-ID").format(
                          Number(field.value.toString().replace(/\D/g, ""))
                        )
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      field.onChange(rawValue ? Number(rawValue) : undefined);
                    }}
                    placeholder="Ex: 50.000.000"
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                  />
                </FormGroup>
              </FormControl>
            )}
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6 }}>
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
        </Grid> */}
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
        {/* <Grid size={{ xs: 12, sm: 6 }}>
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
        </Grid> */}
        <Grid size={{ xs: 12 }}>
          <FormDropdownField
            label="IKU ID"
            control={form.control}
            name="ikuId"
            options={ikuOptions}
            placeholder="Pilih IKU"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Indikator</Typography>
              <Button
                variant="outlined"
                startIcon={<AddOutlined />}
                onClick={() => {
                  append({
                    unitId: "",
                    name: "",
                    masterUnitTypeId: "",
                    category: "",
                    budget: 0,
                    order: fields.length + 1,
                    targetQ1: 0,
                    targetQ2: 0,
                    targetQ3: 0,
                    targetQ4: 0,
                    picIds: [],
                  });
                  setTimeout(() => {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                  }, 100);
                }}
              >
                Tambah Indikator
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {fields.map((item, index) => (
            <IndicatorItem
              key={item.id}
              item={item}
              index={index}
              control={form.control}
              remove={remove}
              unitOptions={unitOptions}
              masterUnitOptions={masterUnitOptions}
            />
          ))}
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
