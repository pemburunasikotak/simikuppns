import { useEffect, useState, useMemo } from "react";
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
  Autocomplete,
  CircularProgress,
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
import { uploadProkerDocument } from "@/api/proker/program/api";
import { useDebounce } from "@/app/_hooks/use-debounce";

import useGetMyUnits from "@/app/proker/unit/_hooks/use-get-my-units";
import { TMyUnitItem } from "@/api/proker/unit/api";
import useGetUnitUsers from "@/app/proker/unit/_hooks/use-get-unit-users";

type ModalAddIndicatorProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  mode: "add" | "edit" | "detail";
  selectedIndicator: TDefaultProgramIndicator | null;
};

const getStatusLabel = (status?: string) => {
  if (status === "ASSIGNED_TO_UNIT") return "Ditugaskan";
  if (status === "DRAFT") return "Draft";
  if (status === "SUBMITTED") return "Diajukan";
  if (status === "REVISION") return "Revisi";
  if (status === "INDICATOR_APPROVED") return "Indikator Disetujui";
  if (status === "APPROVED") return "Disetujui";
  if (status === "REJECTED") return "Ditolak";
  if (status === "IN_PROGRESS") return "Dalam Pengerjaan";
  if (status === "COMPLETED") return "Selesai";
  if (status === "CANCELLED") return "Dibatalkan";
  return status || "-";
};

const createSchema = (mode: "add" | "edit" | "detail") =>
  z.object({
    name: z.string().min(1, "Nama Indikator wajib diisi"),
    category: z.string().min(1, "Kategori wajib dipilih"),
    masterUnitTypeId: z.string().min(1, "Satuan wajib dipilih"),
    unitId: z.string().min(1, "UNIT wajib dipilih"),
    picIds:
      mode === "edit"
        ? z.array(z.string()).optional()
        : z.array(z.string()).min(1, "PIC wajib dipilih"),
    order: z.coerce.number().min(1, "Urutan minimal 1"),
    targetQ1: z.coerce.number().optional(),
    targetQ2: z.coerce.number().optional(),
    targetQ3: z.coerce.number().optional(),
    targetQ4: z.coerce.number().optional(),
    budget: z.string().optional(),
    propsal: z.any().optional(),
    rab: z.any().optional(),
    proposalDocumentId: z.string().optional(),
    rabDocumentId: z.string().optional(),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const ModalAddIndicator = ({ open, onClose, programId, mode, selectedIndicator }: ModalAddIndicatorProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateProgramIndicator();
  const updateMutation = useUpdateProgramIndicator();

  const [isUploading, setIsUploading] = useState(false);
  const isPending = createMutation.isPending || updateMutation.isPending || isUploading;
  const isDetail = mode === "detail";

  const { data: unitTypesData } = useGetProkerMasterUnits({ limit: 50 });
  const unitOptions = unitTypesData?.items?.map(unit => ({ value: unit.id, label: unit.name })) || [];

  const [debouncedUnitSearch, setDebouncedUnitSearch] = useState("");
  const debounce = useDebounce();

  const { data: myUnitsData, isLoading: isUnitsLoading } = useGetMyUnits({
    limit: 100,
    ...(debouncedUnitSearch.trim() ? { search: debouncedUnitSearch.trim(), search_value: debouncedUnitSearch.trim() } : {}),
  });

  const myUnitOptions = useMemo(() => {
    const rawItems = Array.isArray(myUnitsData)
      ? myUnitsData
      : (myUnitsData as unknown as { items?: TMyUnitItem[] })?.items || [];

    const options = rawItems
      .map((item) => ({
        value: item?.unit?.id || item?.id || "",
        label: item?.unit?.name || item?.name || "",
      }))
      .filter((opt) => opt.value && opt.label);

    if (selectedIndicator) {
      const indUnitId =
        selectedIndicator.unitId ||
        (typeof selectedIndicator.unit === "object" && selectedIndicator.unit !== null
          ? selectedIndicator.unit.id
          : typeof selectedIndicator.unit === "string"
            ? selectedIndicator.unit
            : "");
      const indUnitName =
        (typeof selectedIndicator.unit === "object" && selectedIndicator.unit !== null
          ? selectedIndicator.unit.name
          : "") || indUnitId;

      if (indUnitId && !options.some((o) => o.value === indUnitId)) {
        options.unshift({ value: indUnitId, label: indUnitName || indUnitId });
      }
    }

    return options;
  }, [myUnitsData, selectedIndicator]);

  const handleUnitInputChange = (
    _event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    if (reason === "input") {
      debounce({
        cb: () => setDebouncedUnitSearch(value),
        delay: 400,
      });
    } else if (reason === "clear") {
      setDebouncedUnitSearch("");
    }
  };

  const formSchema = useMemo(() => createSchema(mode), [mode]);

  const { control, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
      // usulanBahanHabisPakai: "",
      // usulanPeralatan: "",
      // usulanMebel: "",
      // usulanPerawatanPerbaikan: "",
      // usulanLainnya: "",
      proposalDocumentId: "",
      rabDocumentId: "",
    },
  });

  const selectedCategory = watch("category");
  const showBudgetAndFiles = Boolean(selectedCategory);

  const selectedUnitId = watch("unitId");
  const { data: usersData } = useGetUnitUsers(selectedUnitId, { limit: 50 });
  const picOptions = usersData?.data?.items?.map((user: { id: string; name: string }) => ({
    value: user.id,
    label: user.name,
  })) || [];

  useEffect(() => {
    if (open) {
      setDebouncedUnitSearch("");
      if ((mode === "edit" || mode === "detail") && selectedIndicator) {
        let masterUnitTypeId = selectedIndicator.masterUnitTypeId || "";
        if (!masterUnitTypeId) {
          if (typeof selectedIndicator.masterUnitType === 'object' && selectedIndicator.masterUnitType !== null) {
            masterUnitTypeId = selectedIndicator.masterUnitType.id;
          } else if (typeof selectedIndicator.masterUnitType === 'string') {
            masterUnitTypeId = selectedIndicator.masterUnitType;
          } else if (typeof selectedIndicator.unit === 'object' && selectedIndicator.unit !== null) {
            masterUnitTypeId = selectedIndicator.unit.id;
          } else if (typeof selectedIndicator.unit === 'string') {
            masterUnitTypeId = selectedIndicator.unit;
          }
        }

        const unitId =
          selectedIndicator.unitId ||
          (typeof selectedIndicator.unit === 'object' && selectedIndicator.unit !== null
            ? selectedIndicator.unit.id
            : typeof selectedIndicator.unit === 'string'
              ? selectedIndicator.unit
              : "");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const initialPicIds = Array.isArray(selectedIndicator.pics)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? selectedIndicator.pics.map((pic: any) => (typeof pic === "object" ? pic.userId || pic.id : pic)).filter(Boolean)
          : [];

        const selInd = selectedIndicator as unknown as Record<string, unknown>;

        const propDocId =
          (selInd.proposalDocumentId as string) ||
          (selInd.proposalDocument as string) ||
          (selInd.proposalURL as string) ||
          (selInd.propsal as string) ||
          "";

        const rabDocId =
          (selInd.rabDocumentId as string) ||
          (selInd.rabDocument as string) ||
          (selInd.rabURL as string) ||
          (selInd.rab as string) ||
          "";

        reset({
          name: selectedIndicator.name || "",
          category: selectedIndicator.category || "",
          masterUnitTypeId,
          unitId,
          picIds: initialPicIds,
          order: selectedIndicator.order || 1,
          targetQ1: selectedIndicator.targetQ1 ?? 0,
          targetQ2: selectedIndicator.targetQ2 ?? 0,
          targetQ3: selectedIndicator.targetQ3 ?? 0,
          targetQ4: selectedIndicator.targetQ4 ?? 0,
          budget: selInd.budget !== undefined && selInd.budget !== null ? formatRupiah(String(selInd.budget)) : "",
          propsal: propDocId,
          proposalDocumentId: propDocId,
          rab: rabDocId,
          rabDocumentId: rabDocId,
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
          proposalDocumentId: "",
          rabDocumentId: "",
        });
      }
    }
  }, [open, mode, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    setDebouncedUnitSearch("");
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

  const onSubmit = async (data: FormData) => {
    if (isDetail) return;

    let proposalVal = data.propsal;
    let rabVal = data.rab;

    if (data.propsal instanceof File) {
      setIsUploading(true);
      try {
        proposalVal = await uploadProkerDocument(data.propsal, "PROPOSAL");
      } catch {
        enqueueSnackbar("Gagal mengunggah berkas Proposal/TOR", { variant: "error" });
        setIsUploading(false);
        return;
      }
    }
    if (data.rab instanceof File) {
      setIsUploading(true);
      try {
        rabVal = await uploadProkerDocument(data.rab, "RAB");
      } catch {
        enqueueSnackbar("Gagal mengunggah berkas RAB", { variant: "error" });
        setIsUploading(false);
        return;
      }
    }
    setIsUploading(false);

    const budgetNum = data.budget
      ? typeof data.budget === "number"
        ? data.budget
        : Number(String(data.budget).replace(/[^0-9]/g, "")) || 0
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (typeof (selectedIndicator as any)?.budget === "number" ? (selectedIndicator as any).budget : 0);

    const selInd = selectedIndicator as unknown as Record<string, unknown> | null;

    const finalProposalDocId =
      typeof proposalVal === "string" && proposalVal
        ? proposalVal
        : data.proposalDocumentId || (selInd?.proposalDocumentId as string) || undefined;

    const finalRabDocId =
      typeof rabVal === "string" && rabVal
        ? rabVal
        : data.rabDocumentId || (selInd?.rabDocumentId as string) || undefined;

    const resolvedUnitId =
      data.unitId ||
      selectedIndicator?.unitId ||
      (typeof selectedIndicator?.unit === 'object' && selectedIndicator.unit !== null ? selectedIndicator.unit.id : "") ||
      "";

    const resolvedMasterUnitTypeId =
      data.masterUnitTypeId ||
      selectedIndicator?.masterUnitTypeId ||
      (typeof selectedIndicator?.masterUnitType === 'object' && selectedIndicator.masterUnitType !== null
        ? selectedIndicator.masterUnitType.id
        : "") ||
      "";

    const fullPayload: import("@/api/proker/manajemenProgram/type").TDefaultProgramIndicatorPayload & Record<string, unknown> = {
      unitId: resolvedUnitId,
      name: data.name,
      masterUnitTypeId: resolvedMasterUnitTypeId,
      category: data.category,
      isDefaultProgramIndicator: Boolean(selInd?.isDefaultProgramIndicator ?? false),
      targetQ1: Number(data.targetQ1 ?? selectedIndicator?.targetQ1 ?? 0),
      targetQ2: Number(data.targetQ2 ?? selectedIndicator?.targetQ2 ?? 0),
      targetQ3: Number(data.targetQ3 ?? selectedIndicator?.targetQ3 ?? 0),
      targetQ4: Number(data.targetQ4 ?? selectedIndicator?.targetQ4 ?? 0),
      budget: budgetNum,
      picIds: data.picIds || [],
      order: Number(data.order || selectedIndicator?.order || 1),
      ...(finalProposalDocId ? { proposalDocumentId: finalProposalDocId } : {}),
      ...(finalRabDocId ? { rabDocumentId: finalRabDocId } : {}),
    };

    if (mode === "add") {
      createMutation.mutate(
        { programId, payload: fullPayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil menambahkan indikator", { variant: "success" });
            handleClose();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || "Gagal menambahkan indikator", {
              variant: "error",
            });
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            enqueueSnackbar(error?.response?.data?.message || "Gagal mengubah indikator", {
              variant: "error",
            });
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "add" ? "Tambah Indikator" : mode === "edit" ? "Ubah Indikator" : "Detail Indikator"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            {isDetail && (
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <FormLabel>Status Penugasan</FormLabel>
                  <FormGroup sx={{ mt: 1 }}>
                    <BaseInputText
                      variant="outlined"
                      value={getStatusLabel(selectedIndicator?.status)}
                      disabled
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField
                control={control}
                name="name"
                label="Nama Indikator"
                placeholder="Contoh: Jumlah Publikasi"
                required
                disabled={isDetail}
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
                disabled={isDetail}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                control={control}
                name="unitId"
                render={({ field, fieldState }) => {
                  const selectedOption =
                    myUnitOptions.find((opt) => opt.value === field.value) || null;

                  return (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={fieldState.invalid}
                      disabled={isDetail}
                      sx={{ backgroundColor: "white" }}
                    >
                      <FormLabel required error={fieldState.invalid}>
                        UNIT
                      </FormLabel>
                      <Autocomplete
                        options={myUnitOptions}
                        value={selectedOption}
                        disabled={isDetail}
                        loading={isUnitsLoading}
                        isOptionEqualToValue={(option, val) => option.value === val?.value}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.label || ""
                        }
                        onChange={(_, newValue) => {
                          field.onChange(newValue ? newValue.value : "");
                        }}
                        onInputChange={handleUnitInputChange}
                        noOptionsText="Unit tidak ditemukan"
                        renderInput={(params) => (
                          <BaseInputText
                            {...params}
                            placeholder={isDetail ? "" : "Cari & Pilih Unit..."}
                            error={fieldState.invalid}
                            helperText={fieldState.error?.message}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isUnitsLoading ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  );
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDropdownField
                control={control}
                name="masterUnitTypeId"
                label="Satuan"
                options={unitOptions}
                required
                disabled={isDetail}
              />
            </Grid>

            <Grid size={{ xs: 12, md: showBudgetAndFiles ? 6 : 12 }}>
              <FormDropdownCheckboxField
                control={control}
                name="picIds"
                label="PIC"
                options={picOptions}
                required={mode !== "edit"}
                disabled={isDetail}
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
                          disabled={isDetail}
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
                disabled={isDetail}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ2"
                label="Target Q2"
                type="number"
                required
                disabled={isDetail}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ3"
                label="Target Q3"
                type="number"
                required
                disabled={isDetail}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <FormTextField
                control={control}
                name="targetQ4"
                label="Target Q4"
                type="number"
                required
                disabled={isDetail}
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
                        label="TOR"
                        name="propsal"
                        disabled={isDetail}
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
                    name="rab"
                    control={control}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormUploadField
                        label="RAB"
                        name="rab"
                        disabled={isDetail}
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

                {/* {selectedCategory === "RUTIN" && (
                  <>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usulanBahanHabisPakai"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormUploadField
                            label="Usulan Bahan Habis Pakai (Opsional)"
                            name="usulanBahanHabisPakai"
                            disabled={isDetail}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                            error={!!error}
                            helper={error?.message}
                            acceptFormat=".pdf,.doc,.docx,.xls,.xlsx"
                            uploadDesc="Format Dokumen PDF, DOCX, XLS, XLSX"
                            templateType="FORMAT_USULAN_BAHAN_HABIS"
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usulanPeralatan"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormUploadField
                            label="Usulan Peralatan (Opsional)"
                            name="usulanPeralatan"
                            disabled={isDetail}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                            error={!!error}
                            helper={error?.message}
                            acceptFormat=".pdf,.doc,.docx,.xls,.xlsx"
                            uploadDesc="Format Dokumen PDF, DOCX, XLS, XLSX"
                            templateType="FORMAT_USULAN_PERALATAN"
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usulanMebel"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormUploadField
                            label="Usulan Mebel (Opsional)"
                            name="usulanMebel"
                            disabled={isDetail}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                            error={!!error}
                            helper={error?.message}
                            acceptFormat=".pdf,.doc,.docx,.xls,.xlsx"
                            uploadDesc="Format Dokumen PDF, DOCX, XLS, XLSX"
                            templateType="FORMAT_USULAN_MEUBELAIR"
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usulanPerawatanPerbaikan"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormUploadField
                            label="Usulan Perawatan & Perbaikan (Opsional)"
                            name="usulanPerawatanPerbaikan"
                            disabled={isDetail}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                            error={!!error}
                            helper={error?.message}
                            acceptFormat=".pdf,.doc,.docx,.xls,.xlsx"
                            uploadDesc="Format Dokumen PDF, DOCX, XLS, XLSX"
                            templateType="FORMAT_USULAN_PERBAIKAN"
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name="usulanLainnya"
                        control={control}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <FormUploadField
                            label="Usulan Pelatihan (Opsional)"
                            name="usulanLainnya"
                            disabled={isDetail}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onChange(file);
                            }}
                            value={value && typeof value === 'object' ? (value as File).name : (value as string) || ""}
                            error={!!error}
                            helper={error?.message}
                            acceptFormat=".pdf,.doc,.docx,.xls,.xlsx"
                            uploadDesc="Format Dokumen PDF, DOCX, XLS, XLSX"
                            templateType="FORMAT_USULAN_PELATIHAN"
                          />
                        )}
                      />
                    </Grid>
                  </>
                )} */}

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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {isDetail ? (
            <Button onClick={handleClose} variant="contained" color="primary" sx={{ fontWeight: 700 }}>
              Tutup
            </Button>
          ) : (
            <>
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
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAddIndicator;
