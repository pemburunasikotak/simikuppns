import { Box, Chip, Typography } from "@mui/material";
import { PictureAsPdfOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { TUnitBudgetProposal } from "@/api/proker/usulanAnggaran/type";
import { formatCurrency } from "../_utils/format";

export type TRow = TUnitBudgetProposal & { rowId: string };

interface GetColumnsOptions {
    getUnitName: (unitId: string, itemUnitName?: string) => string;
    onPreviewDoc: (doc: { url: string; title: string }) => void;
    onEdit: (item: TUnitBudgetProposal) => void;
    onDelete: (item: TUnitBudgetProposal) => void;
}

export const getProposalColumns = ({
    getUnitName,
    onPreviewDoc,
    onEdit,
    onDelete,
}: GetColumnsOptions): GridColDef<TRow>[] => {
    const renderDocValueCell = (
        value?: number,
        url?: string | null,
        docId?: string | null,
        titleLabel = "Dokumen Usulan"
    ) => {
        const formattedVal = formatCurrency(value);
        const hasDoc = !!(url || docId);
        const targetUrl = url || (docId ? `/api/v1/documents/${docId}` : "");

        return (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", py: 0.5 }}>
                <Typography variant="body2" fontWeight={600}>
                    {formattedVal}
                </Typography>
                {hasDoc && (
                    <Box
                        onClick={() => {
                            if (targetUrl) {
                                onPreviewDoc({ url: targetUrl, title: titleLabel });
                            }
                        }}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 0.25,
                            cursor: "pointer",
                            color: "primary.main",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        <PictureAsPdfOutlined sx={{ fontSize: 14, color: "error.main" }} />
                        <Typography variant="caption" fontWeight={600} color="primary.main">
                            Lihat Dokumen
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };

    return [
        {
            field: "year",
            headerName: "Tahun",
            width: 100,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <Chip
                        label={params.row.year}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, borderRadius: "6px" }}
                    />
                </Box>
            ),
        },
        {
            field: "unitId",
            headerName: "Unit",
            minWidth: 180,
            flex: 1.2,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <Typography variant="body2" fontWeight={700}>
                        {getUnitName(params.row.unitId, params.row.unit?.name)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: "perbaikanValue",
            headerName: "Perbaikan",
            minWidth: 160,
            flex: 1,
            renderCell: (params) =>
                renderDocValueCell(
                    params.row.perbaikanValue,
                    params.row.perbaikanURL,
                    params.row.perbaikanDocumentId,
                    "Format Usulan Perbaikan"
                ),
        },
        {
            field: "bahanHabisValue",
            headerName: "Bahan Habis",
            minWidth: 160,
            flex: 1,
            renderCell: (params) =>
                renderDocValueCell(
                    params.row.bahanHabisValue,
                    params.row.bahanHabisURL,
                    params.row.bahanHabisDocumentId,
                    "Format Usulan Bahan Habis"
                ),
        },
        {
            field: "peralatanValue",
            headerName: "Peralatan",
            minWidth: 160,
            flex: 1,
            renderCell: (params) =>
                renderDocValueCell(
                    params.row.peralatanValue,
                    params.row.peralatanURL,
                    params.row.peralatanDocumentId,
                    "Format Usulan Peralatan"
                ),
        },
        {
            field: "pelatihanValue",
            headerName: "Pelatihan",
            minWidth: 160,
            flex: 1,
            renderCell: (params) =>
                renderDocValueCell(
                    params.row.pelatihanValue,
                    params.row.pelatihanURL,
                    params.row.pelatihanDocumentId,
                    "Format Usulan Pelatihan"
                ),
        },
        {
            field: "meubelairValue",
            headerName: "Meubelair",
            minWidth: 160,
            flex: 1,
            renderCell: (params) =>
                renderDocValueCell(
                    params.row.meubelairValue,
                    params.row.meubelairURL,
                    params.row.meubelairDocumentId,
                    "Format Usulan Meubelair"
                ),
        },
        {
            field: "totalValue",
            headerName: "Total Usulan",
            minWidth: 180,
            flex: 1.1,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <Typography variant="body2" fontWeight={800} color="secondary.main">
                        {formatCurrency(params.row.totalValue)}
                    </Typography>
                </Box>
            ),
        },
        {
            field: "actions",
            headerName: "Aksi",
            width: 110,
            sortable: false,
            renderCell: (params) => (
                <ActionButtonTable
                    items={[
                        {
                            key: "edit",
                            type: "edit",
                            onClick: () => onEdit(params.row),
                        },
                        {
                            key: "delete",
                            type: "delete",
                            onClick: () => onDelete(params.row),
                        },
                    ]}
                />
            ),
        },
    ];
};
