import React from "react";
import { Grid, Card, CardContent, Stack, Box, Typography, Button } from "@mui/material";
import {
    AccountBalanceWalletOutlined,
    ReceiptLongOutlined,
    FileDownloadOutlined,
} from "@mui/icons-material";
import { TemplateType } from "@/api/proker/program/api";
import { formatCurrency } from "../_utils/format";

interface SummaryCardsProps {
    grandTotal: number;
    totalItems: number;
    onTemplateDownload: (type: TemplateType) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
    grandTotal,
    totalItems,
    onTemplateDownload,
}) => {
    return (
        <Grid container spacing={2}>
            {/* Total Pagu Usulan */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "none" }}>
                    <CardContent sx={{ py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    p: 1.25,
                                    borderRadius: "10px",
                                    bgcolor: "rgba(156, 39, 176, 0.1)",
                                    color: "secondary.main",
                                    display: "flex",
                                }}
                            >
                                <AccountBalanceWalletOutlined fontSize="medium" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    Total Pagu Usulan
                                </Typography>
                                <Typography variant="h6" fontWeight={800} color="secondary.main">
                                    {formatCurrency(grandTotal)}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Jumlah Usulan Unit */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "none" }}>
                    <CardContent sx={{ py: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    p: 1.25,
                                    borderRadius: "10px",
                                    bgcolor: "rgba(25, 118, 210, 0.1)",
                                    color: "primary.main",
                                    display: "flex",
                                }}
                            >
                                <ReceiptLongOutlined fontSize="medium" />
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    Jumlah Usulan Unit
                                </Typography>
                                <Typography variant="h6" fontWeight={800}>
                                    {totalItems} Unit
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Download Templates */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                <Card sx={{ borderRadius: "12px", border: "1px solid #e0e0e0", boxShadow: "none" }}>
                    <CardContent sx={{ py: 1 }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: "block" }}>
                            Unduh Template Formats Usulan Anggaran:
                        </Typography>
                        <Stack direction="row" spacing={0.75} flexWrap="nowrap" sx={{ overflowX: "auto", pb: 0.5 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadOutlined fontSize="small" />}
                                onClick={() => onTemplateDownload("FORMAT_USULAN_PERBAIKAN")}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "6px", px: 1, minWidth: "auto", whiteSpace: "nowrap" }}
                            >
                                Perbaikan
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadOutlined fontSize="small" />}
                                onClick={() => onTemplateDownload("FORMAT_USULAN_BAHAN_HABIS")}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "6px", px: 1, minWidth: "auto", whiteSpace: "nowrap" }}
                            >
                                Bahan Habis
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadOutlined fontSize="small" />}
                                onClick={() => onTemplateDownload("FORMAT_USULAN_PERALATAN")}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "6px", px: 1, minWidth: "auto", whiteSpace: "nowrap" }}
                            >
                                Peralatan
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadOutlined fontSize="small" />}
                                onClick={() => onTemplateDownload("FORMAT_USULAN_PELATIHAN")}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "6px", px: 1, minWidth: "auto", whiteSpace: "nowrap" }}
                            >
                                Pelatihan
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<FileDownloadOutlined fontSize="small" />}
                                onClick={() => onTemplateDownload("FORMAT_USULAN_MEUBELAIR")}
                                sx={{ textTransform: "none", fontSize: "0.75rem", borderRadius: "6px", px: 1, minWidth: "auto", whiteSpace: "nowrap" }}
                            >
                                Meubelair
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
