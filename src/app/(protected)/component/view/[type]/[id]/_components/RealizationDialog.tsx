import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  IconButton,
  CircularProgress,
  Divider,
  alpha,
} from "@mui/material";
import {
  CloudUploadOutlined,
  CloseOutlined,
  SaveOutlined,
  DescriptionOutlined,
  DeleteOutline,
  AddOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { TMetricYearData } from "@/api/master/metrics/type";
import { uploadDocuments } from "@/api/master/metrics";
import { useSnackbar } from "notistack";
import useGetDetailComponentRealization from "../../../../_hooks/use-get-detail-component-realization";
import useGetDetailIKUResult from "../../../../_hooks/use-get-detail-iku-result";
import useSubmitIKUResult from "../../../../_hooks/use-submit-iku-result";

import { TRealizationDocument } from "@/api/master/component-realization/type";
import { UseMutationResult } from "@tanstack/react-query";
import { TResponse } from "@/commons/types/response";

interface RealizationUpdatePayload {
  idComponent: string;
  month: number;
  year: number;
  value: string | number;
  documentIds: string[];
  prodiId?: string;
  narrative?: string;
}

interface RealizationDialogProps {
  open: boolean;
  onClose: () => void;
  yearData: TMetricYearData | null;
  idComponent: string;
  updateRealization: UseMutationResult<TResponse<unknown>, unknown, RealizationUpdatePayload>;
  metricType: string;
  selectedMonth?: number | null;
  prodiId?: string;
  dataType?: string;
  type?: string;
  unit?: string
}

interface TFileItem {
  file?: File;
  id?: string;
  name: string;
  previewUrl: string;
  dataType: string;
  type: string;
}

const RealizationDialog: React.FC<RealizationDialogProps> = ({
  open,
  onClose,
  yearData,
  idComponent,
  updateRealization,
  metricType,
  selectedMonth,
  prodiId,
  dataType,
  type,
  unit
}) => {
  const isYearly = metricType.toLowerCase() === "tahunan" || metricType.toLowerCase() === "yearly" || metricType.toLowerCase() === "";

  const { data: componentDetailData, isLoading: isFetchingComponentDetail } = useGetDetailComponentRealization({
    id: idComponent,
    month: selectedMonth ?? undefined
  }, {
    enabled: type !== "IKU" && !!idComponent
  });

  const { data: ikuDetailData, isLoading: isFetchingIkuDetail } = useGetDetailIKUResult({
    id: idComponent,
  }, {
    enabled: type === "IKU" && !!idComponent
  });

  const isFetchingDetail = type === "IKU" ? isFetchingIkuDetail : isFetchingComponentDetail;

  const submitIkuResultMutation = useSubmitIKUResult();

  const [monthlyValues, setMonthlyValues] = useState<Record<number, string | number>>({});
  const [fileItems, setFileItems] = useState<TFileItem[]>([]);
  const [selectedFileForDetail, setSelectedFileForDetail] = useState<TFileItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [narrativeValue, setNarrativeValue] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();

  const isImageFile = (item: TFileItem) => {
    if (item.file) {
      return item.file.type.startsWith("image/");
    }
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name);
  };

  useEffect(() => {
    if (yearData && open) {
      const initialValues: Record<number, string | number> = {};
      if (isYearly) {
        const realization = yearData.realizations[0];
        initialValues[0] = realization ? realization.value : "";
      } else {
        for (let i = 1; i <= 12; i++) {
          const realization = yearData.realizations.find((r) => r.month === i);
          initialValues[i] = realization ? realization.value : "";
        }
      }
      setMonthlyValues(initialValues);
      setFileItems([]);
      setNarrativeValue("");
    }
  }, [yearData, open, isYearly, idComponent]);


  // Populate values from fetched detail data
  useEffect(() => {
    if (!open) return;

    if (type === "IKU") {
      const data = ikuDetailData;
      if (data?.result) {
        const result = data.result;
        const isText = unit?.toLowerCase() === "text";
        const val = isText ? result.textValue : result.calculatedValue;

        setMonthlyValues((prev) => ({
          ...prev,
          [isYearly ? 0 : (Number(result.month) || 0)]: val !== undefined && val !== null ? val : "",
        }));
        setNarrativeValue(result.narrative || "");

        const rawDocIds = result.documentIds;
        let docIds: string[] = [];
        if (Array.isArray(rawDocIds)) {
          docIds = rawDocIds;
        } else if (typeof rawDocIds === "string" && rawDocIds.trim() !== "") {
          try {
            const parsed = JSON.parse(rawDocIds);
            if (Array.isArray(parsed)) {
              docIds = parsed;
            } else {
              docIds = [rawDocIds];
            }
          } catch {
            docIds = rawDocIds.includes(",") ? rawDocIds.split(",") : [rawDocIds];
          }
        }

        if (docIds.length > 0) {
          const baseUrl = "https://sim.ntech.web.id";
          setFileItems(docIds.map((docId: string) => ({
            id: docId,
            name: `Dokumen (${docId.slice(0, 8)})`,
            previewUrl: `${baseUrl}/api/documents/${docId}`,
            dataType: dataType ?? "document",
            type: type ?? "COMPONENT"
          })));
        } else {
          setFileItems([]);
        }
      } else {
        setFileItems([]);
      }
    } else {
      const data = componentDetailData;
      if (data?.result) {
        const result = data.result;
        const realization = result.realization;

        if (realization) {
          setMonthlyValues((prev) => ({
            ...prev,
            [isYearly ? 0 : realization.month]: realization.value !== undefined && realization.value !== null ? realization.value : "",
          }));
          setNarrativeValue(realization.narrative || "");

          const docs = realization.documents || [];
          if (docs.length > 0) {
            const baseUrl = "https://sim.ntech.web.id";
            setFileItems(docs.map((item: TRealizationDocument) => {
              const doc = item.document;
              return {
                id: doc?.id || item.documentId,
                name: doc?.originalName || "Dokumen",
                previewUrl: doc?.url ? (doc.url.startsWith('http') ? doc.url : `${baseUrl}${doc.url}`) : "",
                dataType: dataType ?? "document",
                type: type ?? "COMPONENT"
              };
            }));
          } else {
            setFileItems([]);
          }
        } else {
          setFileItems([]);
        }
      } else {
        setFileItems([]);
      }
    }
  }, [
    componentDetailData,
    ikuDetailData,
    open,
    isYearly,
    idComponent,
    isFetchingComponentDetail,
    isFetchingIkuDetail,
    dataType,
    type,
    unit
  ]);

  useEffect(() => {
    return () => {
      fileItems.forEach(item => {
        if (item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [fileItems]);

  const handleValueChange = (month: number, value: string) => {
    setMonthlyValues((prev) => ({
      ...prev,
      [month]: value,
    }));
  };

  const renderInputFields = ({ type }: { type?: string }) => {
    const isText = unit?.toLowerCase() === "text";
    const monthKey = type === "bulan" ? (selectedMonth ?? 0) : 0;

    // if (isYearly) {
    return (
      <TextField
        fullWidth
        multiline={isText}
        rows={isText ? 4 : undefined}
        label={`Nilai ${type === "bulan" ? "Bulanan" : "Tahunan"}`}
        value={monthlyValues[monthKey] ?? ""}
        onChange={(e) => handleValueChange(monthKey, e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fff",
          },
        }}
      />
    );
    // }

    // return (
    //   <Grid container spacing={2}>
    //     {months
    //       .map((name, index) => ({ name, index }))
    //       .filter(({ index }) => selectedMonth === null || selectedMonth === undefined || index + 1 === selectedMonth)
    //       .map(({ name, index }) => {
    //         const monthNum = index + 1;
    //         return (
    //           <Grid size={{ xs: 12, md: (selectedMonth || isText) ? 12 : 6 }} key={monthNum}>
    //             <TextField
    //               size="small"
    //               multiline={isText}
    //               rows={isText ? 4 : undefined}
    //               label={selectedMonth ? `Nilai Bulan ${name} ${yearData?.year}` : name}
    //               fullWidth
    //               type={isText ? undefined : "number"}
    //               value={monthlyValues[monthNum] ?? ""}
    //               onChange={(e) => handleValueChange(monthNum, e.target.value)}
    //               sx={{
    //                 "& .MuiOutlinedInput-root": {
    //                   borderRadius: "12px",
    //                   backgroundColor: "#fff",
    //                 },
    //               }}
    //             />
    //           </Grid>
    //         );
    //       })}
    //   </Grid>
    // );
  };

  const handleFileSelect = (files: FileList) => {
    const newItems: TFileItem[] = Array.from(files).map(file => ({
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      dataType: dataType ?? "document",
      type: type ?? "COMPONENT"
    }));
    setFileItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveFile = (index: number) => {
    setFileItems((prev) => {
      const newItems = [...prev];
      if (newItems[index].previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(newItems[index].previewUrl);
      }
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handelSubmitIku = async () => {
    setIsSubmitting(true);
    try {
      let finalDocumentIds: string[] = [];
      const filesToUpload = fileItems.filter(item => !!item.file).map(item => item.file!);
      const existingIds = fileItems.filter(item => !!item.id).map(item => item.id!);
      if (filesToUpload.length > 0) {
        console.log("Uploading files...", filesToUpload);
        const res = await uploadDocuments(filesToUpload);
        console.log("Upload response:", res);

        if (res.status && res.result) {
          const uploadedIds = res.result.map((doc: { id: string }) => doc.id);
          finalDocumentIds = [...existingIds, ...uploadedIds];
        } else {
          throw new Error(res.message || "Gagal mengunggah dokumen");
        }
      } else {
        finalDocumentIds = existingIds;
      }

      console.log("Saving IKU result with documentIds:", finalDocumentIds);

      const newIdComponent = ikuDetailData?.result?.idIku || idComponent;
      let finalIdComponent = newIdComponent;
      if (prodiId && finalIdComponent.includes("_")) {
        finalIdComponent = finalIdComponent.split("_")[0];
      }

      const isText = unit?.toLowerCase() === "text";

      if (isYearly) {
        await submitIkuResultMutation.mutateAsync({
          idIku: finalIdComponent,
          month: 0,
          year: yearData?.year || 0,
          calculatedValue: isText ? 0 : (Number(monthlyValues[0]) || 0),
          textValue: isText ? (monthlyValues[0]?.toString() || "") : "",
          documentIds: finalDocumentIds,
          metadata: {},
          formulaVersion: "1.0.0",
          calculatedAt: new Date().toISOString(),
          narrative: narrativeValue,
        });
      } else {
        const monthsToUpdate = Object.entries(monthlyValues).filter(([month]) =>
          selectedMonth === null || selectedMonth === undefined || Number(month) === selectedMonth
        );

        const savePromises = monthsToUpdate.map(([month, value]) =>
          submitIkuResultMutation.mutateAsync({
            idIku: finalIdComponent,
            month: Number(month),
            year: yearData?.year || 0,
            calculatedValue: isText ? 0 : (Number(value) || 0),
            textValue: isText ? (value?.toString() || "") : "",
            documentIds: finalDocumentIds,
            metadata: {},
            formulaVersion: "1.0.0",
            calculatedAt: new Date().toISOString(),
            narrative: narrativeValue,
          })
        );
        await Promise.all(savePromises);
      }

      enqueueSnackbar("Data IKU berhasil disimpan", { variant: "success" });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan data";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSubmitting(true);
    try {
      let finalDocumentIds: string[] = [];
      const filesToUpload = fileItems.filter(item => !!item.file).map(item => item.file!);
      const existingIds = fileItems.filter(item => !!item.id).map(item => item.id!);
      if (filesToUpload.length > 0) {
        console.log("Uploading files...", filesToUpload);
        const res = await uploadDocuments(filesToUpload);
        console.log("Upload response:", res);

        if (res.status && res.result) {
          const uploadedIds = res.result.map((doc: { id: string }) => doc.id);
          finalDocumentIds = [...existingIds, ...uploadedIds];
        } else {
          throw new Error(res.message || "Gagal mengunggah dokumen");
        }
      } else {
        finalDocumentIds = existingIds;
      }

      console.log("Saving realization with documentIds:", finalDocumentIds);

      const newIdComponent = componentDetailData?.result?.realization?.idComponent || idComponent;
      let finalIdComponent = newIdComponent;
      if (prodiId && finalIdComponent.includes("_")) {
        finalIdComponent = finalIdComponent.split("_")[0];
      }

      const isText = unit?.toLowerCase() === "text";

      if (isYearly) {
        await updateRealization.mutateAsync({
          idComponent: finalIdComponent,
          month: 0,
          year: yearData?.year || 0,
          value: isText ? (monthlyValues[0] || "") : (Number(monthlyValues[0]) || 0),
          documentIds: finalDocumentIds,
          narrative: narrativeValue,
          ...(prodiId ? { prodiId } : {}),
        });
      } else {
        // Only update the selected month if provided, otherwise update all months in monthlyValues
        const monthsToUpdate = Object.entries(monthlyValues).filter(([month]) =>
          selectedMonth === null || selectedMonth === undefined || Number(month) === selectedMonth
        );

        const savePromises = monthsToUpdate.map(([month, value]) =>
          updateRealization.mutateAsync({
            idComponent: finalIdComponent,
            month: Number(month),
            year: yearData?.year || 0,
            value: isText ? (value || "") : (Number(value) || 0),
            documentIds: finalDocumentIds,
            narrative: narrativeValue,
            ...(prodiId ? { prodiId } : {}),
          })
        );
        await Promise.all(savePromises);
      }

      enqueueSnackbar("Data berhasil disimpan", { variant: "success" });
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan data";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Realisasi {isYearly ? "Tahunan" : "Bulanan"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tahun {yearData?.year} • {idComponent.split("_")[0]}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 3, backgroundColor: "#fcfcfc", minHeight: 300 }}>
          {isFetchingDetail ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">Memuat data realisasi...</Typography>
            </Box>
          ) : (
            <Stack spacing={4}>
              {type === "IKU" ?
                <>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionOutlined fontSize="small" color="primary" />
                      Input Nilai Realisasi
                    </Typography>
                    {unit === "text" && (
                      <TextField
                        fullWidth
                        multiline={true}
                        rows={4}
                        label={`Deskripsi dan Keterangan`}
                        value={monthlyValues[isYearly ? 0 : (selectedMonth ?? 0)] ?? ""}
                        onChange={(e) => handleValueChange(isYearly ? 0 : (selectedMonth ?? 0), e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                          },
                        }}
                      />
                    )}
                    {unit === "number" && (
                      <>
                        {renderInputFields({ type: 'tahunan' })}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CloudUploadOutlined fontSize="small" color="primary" />
                            Upload Portofolio / Bukti Dukung <span style={{ color: '#ef4444' }}>*</span>
                          </Typography>

                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "16px",
                              border: "2px dashed",
                              borderColor: alpha("#6366f1", 0.3),
                              backgroundColor: alpha("#6366f1", 0.02),
                              minHeight: "150px",
                            }}
                          >
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              {fileItems.map((item, index) => (
                                <Box
                                  key={index}
                                  onClick={() => setSelectedFileForDetail(item)}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    position: "relative",
                                    border: "1px solid #e2e8f0",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    "&:hover": {
                                      borderColor: "#6366f1",
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 8px 16px rgba(99, 102, 241, 0.1)",
                                      "& .hover-overlay": {
                                        opacity: 1,
                                      },
                                    },
                                  }}
                                >
                                  {isImageFile(item) ? (
                                    <img
                                      src={item.previewUrl}
                                      alt={item.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>
                                      <DescriptionOutlined sx={{ fontSize: 32, color: "#6366f1", mb: 0.5 }} />
                                      <Typography variant="caption" sx={{ textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {item.name}
                                      </Typography>
                                    </Box>
                                  )}

                                  <Box
                                    className="hover-overlay"
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "rgba(99, 102, 241, 0.35)",
                                      backdropFilter: "blur(2px)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      opacity: 0,
                                      transition: "opacity 0.2s ease-in-out",
                                    }}
                                  >
                                    <VisibilityOutlined sx={{ color: "#fff", fontSize: 24 }} />
                                  </Box>

                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveFile(index);
                                    }}
                                    sx={{
                                      position: "absolute",
                                      top: 4,
                                      right: 4,
                                      zIndex: 10,
                                      backgroundColor: "rgba(255,255,255,0.8)",
                                      "&:hover": { backgroundColor: "#fff" },
                                    }}
                                  >
                                    <DeleteOutline sx={{ fontSize: 16, color: "#ef4444" }} />
                                  </IconButton>
                                </Box>
                              ))}

                              <Box
                                component="label"
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: "12px",
                                  border: "2px dashed",
                                  borderColor: "#e2e8f0",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  backgroundColor: "#fff",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    borderColor: "#6366f1",
                                    backgroundColor: alpha("#6366f1", 0.02),
                                  },
                                }}
                              >
                                <AddOutlined sx={{ fontSize: 32, color: "#94a3b8" }} />
                                <Typography variant="caption" sx={{ mt: 1, color: "#94a3b8", fontWeight: 600 }}>
                                  Tambah
                                </Typography>
                                <input
                                  type="file"
                                  hidden
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) handleFileSelect(e.target.files);
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ mt: 1, color: "#64748b", display: 'block' }}>
                            Format Foto JPG, PNG, JPEG. Ukuran Maksimal 2 MB
                          </Typography>
                        </Box>
                      </>
                    )}
                    {unit === "file" && (
                      <Box>
                        {/* <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CloudUploadOutlined fontSize="small" color="primary" />
                          Upload Portofolio / Bukti Dukung <span style={{ color: '#ef4444' }}>*</span>
                        </Typography> */}

                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "16px",
                            border: "2px dashed",
                            borderColor: alpha("#6366f1", 0.3),
                            backgroundColor: alpha("#6366f1", 0.02),
                            minHeight: "150px",
                          }}
                        >
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {fileItems.map((item, index) => (
                              <Box
                                key={index}
                                onClick={() => setSelectedFileForDetail(item)}
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  position: "relative",
                                  border: "1px solid #e2e8f0",
                                  backgroundColor: "#fff",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease-in-out",
                                  "&:hover": {
                                    borderColor: "#6366f1",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 8px 16px rgba(99, 102, 241, 0.1)",
                                    "& .hover-overlay": {
                                      opacity: 1,
                                    },
                                  },
                                }}
                              >
                                {isImageFile(item) ? (
                                  <img
                                    src={item.previewUrl}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>
                                    <DescriptionOutlined sx={{ fontSize: 32, color: "#6366f1", mb: 0.5 }} />
                                    <Typography variant="caption" sx={{ textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                      {item.name}
                                    </Typography>
                                  </Box>
                                )}

                                <Box
                                  className="hover-overlay"
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(99, 102, 241, 0.35)",
                                    backdropFilter: "blur(2px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0,
                                    transition: "opacity 0.2s ease-in-out",
                                  }}
                                >
                                  <VisibilityOutlined sx={{ color: "#fff", fontSize: 24 }} />
                                </Box>

                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile(index);
                                  }}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    zIndex: 10,
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    "&:hover": { backgroundColor: "#fff" },
                                  }}
                                >
                                  <DeleteOutline sx={{ fontSize: 16, color: "#ef4444" }} />
                                </IconButton>
                              </Box>
                            ))}

                            <Box
                              component="label"
                              sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "12px",
                                border: "2px dashed",
                                borderColor: "#e2e8f0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                transition: "all 0.2s",
                                "&:hover": {
                                  borderColor: "#6366f1",
                                  backgroundColor: alpha("#6366f1", 0.02),
                                },
                              }}
                            >
                              <AddOutlined sx={{ fontSize: 32, color: "#94a3b8" }} />
                              <Typography variant="caption" sx={{ mt: 1, color: "#94a3b8", fontWeight: 600 }}>
                                Tambah
                              </Typography>
                              <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => {
                                  if (e.target.files) handleFileSelect(e.target.files);
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ mt: 1, color: "#64748b", display: 'block' }}>
                          Format Foto JPG, PNG, JPEG. Ukuran Maksimal 2 MB
                        </Typography>
                      </Box>
                    )}

                  </Box>
                </>
                :
                <>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionOutlined fontSize="small" color="primary" />
                      Input Nilai Realisasi
                    </Typography>
                    {renderInputFields({ type: 'bulan' })}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 800, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CloudUploadOutlined fontSize="small" color="primary" />
                      Upload Portofolio / Bukti Dukung <span style={{ color: '#ef4444' }}>*</span>
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        border: "2px dashed",
                        borderColor: alpha("#6366f1", 0.3),
                        backgroundColor: alpha("#6366f1", 0.02),
                        minHeight: "150px",
                      }}
                    >
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {fileItems.map((item, index) => (
                          <Box
                            key={index}
                            onClick={() => setSelectedFileForDetail(item)}
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: "12px",
                              overflow: "hidden",
                              position: "relative",
                              border: "1px solid #e2e8f0",
                              backgroundColor: "#fff",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                              cursor: "pointer",
                              transition: "all 0.2s ease-in-out",
                              "&:hover": {
                                borderColor: "#6366f1",
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(99, 102, 241, 0.1)",
                                "& .hover-overlay": {
                                  opacity: 1,
                                },
                              },
                            }}
                          >
                            {isImageFile(item) ? (
                              <img
                                src={item.previewUrl}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 1 }}>
                                <DescriptionOutlined sx={{ fontSize: 32, color: "#6366f1", mb: 0.5 }} />
                                <Typography variant="caption" sx={{ textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                  {item.name}
                                </Typography>
                              </Box>
                            )}

                            <Box
                              className="hover-overlay"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(99, 102, 241, 0.35)",
                                backdropFilter: "blur(2px)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.2s ease-in-out",
                              }}
                            >
                              <VisibilityOutlined sx={{ color: "#fff", fontSize: 24 }} />
                            </Box>

                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(index);
                              }}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                zIndex: 10,
                                backgroundColor: "rgba(255,255,255,0.8)",
                                "&:hover": { backgroundColor: "#fff" },
                              }}
                            >
                              <DeleteOutline sx={{ fontSize: 16, color: "#ef4444" }} />
                            </IconButton>
                          </Box>
                        ))}

                        <Box
                          component="label"
                          sx={{
                            width: 120,
                            height: 120,
                            borderRadius: "12px",
                            border: "2px dashed",
                            borderColor: "#e2e8f0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "#6366f1",
                              backgroundColor: alpha("#6366f1", 0.02),
                            },
                          }}
                        >
                          <AddOutlined sx={{ fontSize: 32, color: "#94a3b8" }} />
                          <Typography variant="caption" sx={{ mt: 1, color: "#94a3b8", fontWeight: 600 }}>
                            Tambah
                          </Typography>
                          <input
                            type="file"
                            hidden
                            multiple
                            onChange={(e) => {
                              if (e.target.files) handleFileSelect(e.target.files);
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 1, color: "#64748b", display: 'block' }}>
                      Format Foto JPG, PNG, JPEG. Ukuran Maksimal 2 MB
                    </Typography>
                  </Box>
                </>}
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Narasi"
                  placeholder="Masukkan narasi realisasi..."
                  value={narrativeValue}
                  onChange={(e) => setNarrativeValue(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 3, backgroundColor: "#fff", justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              fontWeight: 700,
              color: "#64748b",
              textTransform: "none",
              borderRadius: "10px",
              px: 4,
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SaveOutlined />}
            onClick={type === "IKU" ? handelSubmitIku : handleSaveAll}
            disabled={isSubmitting}
            sx={{
              borderRadius: "12px",
              px: 5,
              py: 1.2,
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                boxShadow: "0 12px 25px rgba(99, 102, 241, 0.4)",
              },
            }}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Realisasi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Document Dialog */}
      <Dialog
        open={!!selectedFileForDetail}
        onClose={() => setSelectedFileForDetail(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.15)" },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", overflow: "hidden", pr: 2 }}>
            Detail Dokumen
          </Typography>
          <IconButton onClick={() => setSelectedFileForDetail(null)} sx={{ color: "#94a3b8" }}>
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300, backgroundColor: "#f8fafc" }}>
          {selectedFileForDetail && (
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {isImageFile(selectedFileForDetail) ? (
                <Box
                  component="img"
                  src={selectedFileForDetail.previewUrl}
                  alt={selectedFileForDetail.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "65vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                  }}
                />
              ) : selectedFileForDetail.name.toLowerCase().endsWith(".pdf") || (selectedFileForDetail.file && selectedFileForDetail.file.type === "application/pdf") ? (
                <Box sx={{ width: "100%", height: "65vh", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                  <iframe
                    src={selectedFileForDetail.previewUrl}
                    title={selectedFileForDetail.name}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  />
                </Box>
              ) : (
                <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
                  <DescriptionOutlined sx={{ fontSize: 80, color: "#6366f1" }} />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                      {selectedFileForDetail.name}
                    </Typography>
                    {selectedFileForDetail.file && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Ukuran: {(selectedFileForDetail.file.size / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    )}
                  </Box>
                </Stack>
              )}
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5, backgroundColor: "#fff", gap: 1.5 }}>
          <Button
            onClick={() => setSelectedFileForDetail(null)}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#cbd5e1",
              color: "#64748b",
              "&:hover": { borderColor: "#94a3b8", backgroundColor: "#f8fafc" },
            }}
          >
            Tutup
          </Button>
          {selectedFileForDetail && (
            <Button
              variant="contained"
              onClick={() => window.open(selectedFileForDetail.previewUrl, "_blank")}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(99, 102, 241, 0.3)",
                },
              }}
            >
              Buka di Tab Baru
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RealizationDialog;
