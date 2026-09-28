import React from "react";
import {
    Card,
    Stack,
    Grid,
    Typography,
    Button,
    FormControl,
    FormLabel,
    InputAdornment,
} from "@mui/material";
import { FileDownloadOutlined, CloudUploadOutlined } from "@mui/icons-material";
import BaseInputText from "@/app/_components/ui/base-input-text";
import { TemplateType } from "@/api/proker/program/api";
import { formatRupiah } from "../_utils/format";

interface CategoryInputCardProps {
    title: string;
    categoryLabel: string;
    templateType: TemplateType;
    value: string;
    onValueChange: (value: string) => void;
    file: File | null;
    onFileChange: (file: File | null) => void;
    docId?: string;
    onTemplateDownload: (type: TemplateType) => void;
}

export const CategoryInputCard: React.FC<CategoryInputCardProps> = ({
    title,
    categoryLabel,
    templateType,
    value,
    onValueChange,
    file,
    onFileChange,
    docId,
    onTemplateDownload,
}) => {
    return (
        <Card variant="outlined" sx={{ borderRadius: "10px", p: 2, bgcolor: "#fafafa" }}>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700}>
                        {title}
                    </Typography>
                    <Button
                        size="small"
                        variant="text"
                        startIcon={<FileDownloadOutlined fontSize="small" />}
                        onClick={() => onTemplateDownload(templateType)}
                        sx={{ textTransform: "none", fontSize: "0.75rem", fontWeight: 600 }}
                    >
                        Unduh Template {categoryLabel}
                    </Button>
                </Stack>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="standard">
                            <FormLabel sx={{ fontSize: "0.8rem", mb: 0.5 }}>Nominal Usulan (Rp)</FormLabel>
                            <BaseInputText
                                variant="outlined"
                                size="small"
                                value={value}
                                placeholder="Contoh: 15.000.000"
                                onChange={(e) => onValueChange(formatRupiah(e.target.value))}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography variant="body2" fontWeight={600}>
                                                Rp
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="standard">
                            <FormLabel sx={{ fontSize: "0.8rem", mb: 0.5 }}>
                                Dokumen Usulan {categoryLabel} (PDF/Excel)
                            </FormLabel>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Button
                                    variant="outlined"
                                    component="label"
                                    size="small"
                                    startIcon={<CloudUploadOutlined />}
                                    sx={{ textTransform: "none", flexShrink: 0 }}
                                >
                                    Pilih File
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.xls,.xlsx,.doc,.docx"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) onFileChange(e.target.files[0]);
                                        }}
                                    />
                                </Button>
                                <Typography variant="caption" noWrap color="text.secondary">
                                    {file
                                        ? file.name
                                        : docId
                                            ? "Dokumen terunggah"
                                            : "Belum ada file dipilih"}
                                </Typography>
                            </Stack>
                        </FormControl>
                    </Grid>
                </Grid>
            </Stack>
        </Card>
    );
};
