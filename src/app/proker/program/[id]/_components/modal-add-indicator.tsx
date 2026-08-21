import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  FormGroup,
  FormLabel,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormUploadField from "@/app/_components/ui/form-upload-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import BaseInputText from "@/app/_components/ui/base-input-text";
import { useGetProkerMasterUnits } from "@/app/proker/master-unit/_hooks/use-get-master-units";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useCreateProgramIndicator from "../_hooks/use-create-program-indicator";
import useUpdateProgramIndicator from "../_hooks/use-update-program-indicator";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";


import useGetMyUnits from "@/app/proker/unit/_hooks/use-get-my-units";
import useGetUnitUsers from "@/app/proker/unit/_hooks/use-get-unit-users";

type ModalAddIndicatorProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  mode: "add" | "edit";
  selectedIndicator: TDefaultProgramIndicator | null;
};

const schema = z.object({
  name: z.string().min(1, "Nama Indikator wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  masterUnitTypeId: z.string().min(1, "Satuan wajib dipilih"),
  unitId: z.string().min(1, "UNIT wajib dipilih"),
  picIds: z.array(z.string()).min(1, "PIC wajib dipilih"),
  order: z.coerce.number().min(1, "Urutan minimal 1"),
  targetQ1: z.coerce.number().optional(),
  targetQ2: z.coerce.number().optional(),
  targetQ3: z.coerce.number().optional(),
  targetQ4: z.coerce.number().optional(),
  budget: z.string().optional(),
  propsal: z.any().optional(),
  rab: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const ModalAddIndicator = ({ open, onClose, programId, mode, selectedIndicator }: ModalAddIndicatorProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateProgramIndicator();
  const updateMutation = useUpdateProgramIndicator();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: unitTypesData } = useGetProkerMasterUnits({ limit: 50 });
  const unitOptions = unitTypesData?.items?.map(unit => ({ value: unit.id, label: unit.name })) || [];

  const { data: myUnitsData } = useGetMyUnits({ limit: 50 });

  console.log('CEK DATA', myUnitsData)
  const myUnitOptions = myUnitsData?.map(item => ({
    value: item?.unit?.id || item?.id || "",
    label: item?.unit?.name || item?.name || "",
  })) || [];

  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      masterUnitTypeId: "",
      unitId: "",
      picIds: [],
      order: 1,
      targetQ1: 0,
      targetQ2: 0,
      targetQ3: 0,
      targetQ4: 0,
      budget: "",
      propsal: "",
      rab: "",
    },
  });

  const selectedCategory = watch("category");
  const showBudgetAndFiles = selectedCategory === "TUSI" || selectedCategory === "PENGEMBANGAN";

  const selectedUnitId = watch("unitId");
  const { data: usersData } = useGetUnitUsers(selectedUnitId, { limit: 50 });
  const picOptions = usersData?.data?.items?.map((user: { id: string; name: string }) => ({
    value: user.id,
    label: user.name,
  })) || [];

  useEffect(() => {
    if (open) {
      if (mode === "edit" && selectedIndicator) {
        let masterUnitTypeId = "";
        if (typeof selectedIndicator.masterUnitType === 'object' && selectedIndicator.masterUnitType !== null) {
          masterUnitTypeId = selectedIndicator.masterUnitType.id;
        } else if (typeof selectedIndicator.masterUnitType === 'string') {
          masterUnitTypeId = selectedIndicator.masterUnitType;
        } else if (typeof selectedIndicator.unit === 'object' && selectedIndicator.unit !== null) {
          masterUnitTypeId = selectedIndicator.unit.id;
        } else if (typeof selectedIndicator.unit === 'string') {
          masterUnitTypeId = selectedIndicator.unit;
        }

        const initialPicIds = Array.isArray(selectedIndicator.pics)
          ? selectedIndicator.pics.map((pic) => pic.userId).filter(Boolean)
          : [];

        reset({
          name: selectedIndicator.name,
          category: selectedIndicator.category || "",
          masterUnitTypeId,
          unitId: selectedIndicator.unitId || "",
          picIds: initialPicIds,
          order: selectedIndicator.order,
          targetQ1: selectedIndicator.targetQ1 || 0,
          targetQ2: selectedIndicator.targetQ2 || 0,
          targetQ3: selectedIndicator.targetQ3 || 0,
          targetQ4: selectedIndicator.targetQ4 || 0,
          budget: ((selectedIndicator as unknown) as { budget?: string }).budget || "",
          propsal: ((selectedIndicator as unknown) as { propsal?: string }).propsal || "",
          rab: ((selectedIndicator as unknown) as { rab?: string }).rab || "",
        });
      } else {
        reset({
          name: "",
          category: "",
          masterUnitTypeId: "",
          unitId: "",
          picIds: [],
          order: 1,
          targetQ1: 0,
          targetQ2: 0,
          targetQ3: 0,
          targetQ4: 0,
          budget: "",
          propsal: "",
          rab: "",
        });
      }
    }
  }, [open, mode, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

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

  const onSubmit = (data: FormData) => {
    const isTusiOrPengembangan = data.category === "TUSI" || data.category === "PENGEMBANGAN";

    const fullPayload: import("@/api/proker/manajemenProgram/type").TDefaultProgramIndicatorPayload = {
      name: data.name,
      category: data.category,
      unit: data.masterUnitTypeId,
      masterUnitTypeId: data.masterUnitTypeId,
      order: Number(data.order || 1),
      unitId: mode === "edit" && selectedIndicator ? data.unitId || selectedIndicator.unitId || "" : data.unitId,
      targetQ1: data.targetQ1 !== undefined && data.targetQ1 !== null ? Number(data.targetQ1) : (mode === "edit" && selectedIndicator ? Number(selectedIndicator.targetQ1 || 0) : 0),
      targetQ2: data.targetQ2 !== undefined && data.targetQ2 !== null ? Number(data.targetQ2) : (mode === "edit" && selectedIndicator ? Number(selectedIndicator.targetQ2 || 0) : 0),
      targetQ3: data.targetQ3 !== undefined && data.targetQ3 !== null ? Number(data.targetQ3) : (mode === "edit" && selectedIndicator ? Number(selectedIndicator.targetQ3 || 0) : 0),
      targetQ4: data.targetQ4 !== undefined && data.targetQ4 !== null ? Number(data.targetQ4) : (mode === "edit" && selectedIndicator ? Number(selectedIndicator.targetQ4 || 0) : 0),
      status: mode === "edit" && selectedIndicator ? selectedIndicator.status || "DRAFT" : "DRAFT",
      budget: isTusiOrPengembangan && data.budget ? Number(data.budget.replace(/[^0-9]/g, "")) : 0,
      picIds: data.picIds || [],
      ...(isTusiOrPengembangan ? { propsal: data.propsal, rab: data.rab } : {}),
    };

    if (mode === "add") {
      createMutation.mutate(
        { programId, payload: fullPayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil menambahkan indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal menambahkan indikator", { variant: "error" });
          },
        }
      );
    } else {
      if (!selectedIndicator) return;
      updateMutation.mutate(
        { programId, id: selectedIndicator.id, payload: fullPayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil mengubah indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal mengubah indikator", { variant: "error" });
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "add" ? "Tambah Indikator" : "Ubah Indikator"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                control={control}
                name="name"
                label="Nama Indikator"
                placeholder="Contoh: Jumlah Publikasi"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDropdownField
                label="Kategori"
                control={control}
                name="category"
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
                name="unitId"
                label="UNIT"
                options={myUnitOptions}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDropdownField
                control={control}
                name="masterUnitTypeId"
                label="Satuan"
                options={unitOptions}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: showBudgetAndFiles ? 6 : 12 }}>
              <FormDropdownCheckboxField
                control={control}
                name="picIds"
                label="PIC"
                options={picOptions}
                required
              />
            </Grid>

            {showBudgetAndFiles && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl variant="standard" sx={{ width: "100%" }}>
                      <FormLabel htmlFor="budget" error={fieldState.invalid} required>
                        Budget
                      </FormLabel>
                      <FormGroup>
                        <BaseInputText
                          id="budget"
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
                name="targetQ1"
                label="Target Q1"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ2"
                label="Target Q2"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ3"
                label="Target Q3"
                type="number"
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ4"
                label="Target Q4"
                type="number"
                required
              />
            </Grid>

            {showBudgetAndFiles && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="propsal"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormUploadField
                        label="Proposal"
                        name="propsal"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                        error={!!error}
                        helper={error?.message}
                        acceptFormat=".pdf,.doc,.docx"
                        uploadDesc="Format Dokumen PDF, DOCX"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="rab"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormUploadField
                        label="RAB"
                        name="rab"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                        error={!!error}
                        helper={error?.message}
                        acceptFormat=".pdf,.xls,.xlsx"
                        uploadDesc="Format Dokumen PDF, XLSX"
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            sx={{ fontWeight: 700 }}
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAddIndicator;
