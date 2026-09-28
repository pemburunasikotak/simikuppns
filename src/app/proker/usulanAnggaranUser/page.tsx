import { useState } from "react";
import { Typography, Button, Stack } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";
import DocumentPreviewModal from "@/app/_components/ui/document-preview-modal";

import { useGetUnitBudgetProposals } from "./_hooks/use-get-unit-budget-proposals";
import { useSaveUnitBudgetProposal } from "./_hooks/use-save-unit-budget-proposal";
import { useDeleteUnitBudgetProposal } from "./_hooks/use-delete-unit-budget-proposal";
import { TUnitBudgetProposal } from "@/api/proker/usulanAnggaran/type";
import useGetMyUnits from "@/app/proker/unit/_hooks/use-get-my-units";
import { useGetProkerUnits } from "@/app/proker/unit/_hooks/use-get-units";
import { downloadTemplate, uploadProkerDocument, TemplateType } from "@/api/proker/program/api";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";

import { formatRupiah, parseRupiahNumber } from "./_utils/format";
import { SummaryCards } from "./_components/summary-cards";
import { getProposalColumns, TRow } from "./_components/columns";
import { ProposalFormDialog } from "./_components/proposal-form-dialog";
import { DeleteProposalDialog } from "./_components/delete-proposal-dialog";

export default function UsulanAnggaranUserPage() {
    const { enqueueSnackbar } = useSnackbar();

    const { filters, setFilter } = useFilter<{
        search?: string;
        search_value?: string;
        unitId?: string;
        year?: string | number;
        page?: number;
        per_page?: number;
    }>();

    const queryParams = {
        ...filters,
        search: filters.search_value || filters.search,
        unitId: filters.unitId,
        year: filters.year ? Number(filters.year) : undefined,
        page: filters.page ? Number(filters.page) : 1,
        limit: filters.per_page ? Number(filters.per_page) : 10,
    };

    const user = ProkerSessionUser.get()?.user;
    const userRoleKeys = user?.roles?.map((r: { key: string }) => r.key) || [];
    const isAdmin = userRoleKeys.includes("admin_sim_proker");

    const query = useGetUnitBudgetProposals(queryParams, { isMyUnitsOnly: !isAdmin });
    const saveMutation = useSaveUnitBudgetProposal();
    const deleteMutation = useDeleteUnitBudgetProposal();

    const { data: myUnitsData } = useGetMyUnits({ limit: 100 });
    const { data: prokerUnitsData } = useGetProkerUnits({ limit: 100 });

    const allUnits = prokerUnitsData?.items || [];
    const myUnits = myUnitsData || [];

    const myUnitsFormatted = myUnits
        .map((u) => ({
            id: u.unit?.id || u.id || "",
            name: u.unit?.name || u.name || "",
        }))
        .filter((u) => u.id);

    const availableUnits = isAdmin
        ? (allUnits.length > 0 ? allUnits : myUnitsFormatted)
        : myUnitsFormatted;

    const getUnitName = (unitId: string, itemUnitName?: string) => {
        if (itemUnitName) return itemUnitName;
        const foundMy = myUnits.find((u) => (u.unit?.id || u.id) === unitId);
        if (foundMy?.unit?.name || foundMy?.name) return foundMy.unit?.name || foundMy.name || unitId;
        const foundAll = allUnits.find((u) => u.id === unitId);
        if (foundAll?.name) return foundAll.name;
        return unitId;
    };

    const [openModal, setOpenModal] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<TUnitBudgetProposal | null>(null);

    const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

    // Form State
    const [formUnitId, setFormUnitId] = useState<string>("");
    const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // 5 Categories State
    const [perbaikanVal, setPerbaikanVal] = useState<string>("");
    const [perbaikanDocId, setPerbaikanDocId] = useState<string>("");
    const [perbaikanFile, setPerbaikanFile] = useState<File | null>(null);

    const [bahanHabisVal, setBahanHabisVal] = useState<string>("");
    const [bahanHabisDocId, setBahanHabisDocId] = useState<string>("");
    const [bahanHabisFile, setBahanHabisFile] = useState<File | null>(null);

    const [peralatanVal, setPeralatanVal] = useState<string>("");
    const [peralatanDocId, setPeralatanDocId] = useState<string>("");
    const [peralatanFile, setPeralatanFile] = useState<File | null>(null);

    const [pelatihanVal, setPelatihanVal] = useState<string>("");
    const [pelatihanDocId, setPelatihanDocId] = useState<string>("");
    const [pelatihanFile, setPelatihanFile] = useState<File | null>(null);

    const [meubelairVal, setMeubelairVal] = useState<string>("");
    const [meubelairDocId, setMeubelairDocId] = useState<string>("");
    const [meubelairFile, setMeubelairFile] = useState<File | null>(null);

    const handleOpenAdd = () => {
        setSelectedProposal(null);
        setFormUnitId(availableUnits[0]?.id || "");
        setFormYear(new Date().getFullYear());

        setPerbaikanVal("");
        setPerbaikanDocId("");
        setPerbaikanFile(null);

        setBahanHabisVal("");
        setBahanHabisDocId("");
        setBahanHabisFile(null);

        setPeralatanVal("");
        setPeralatanDocId("");
        setPeralatanFile(null);

        setPelatihanVal("");
        setPelatihanDocId("");
        setPelatihanFile(null);

        setMeubelairVal("");
        setMeubelairDocId("");
        setMeubelairFile(null);

        setOpenModal(true);
    };

    const handleOpenEdit = (item: TUnitBudgetProposal) => {
        setSelectedProposal(item);
        setFormUnitId(item.unitId);
        setFormYear(item.year);

        setPerbaikanVal(formatRupiah(item.perbaikanValue || 0));
        setPerbaikanDocId(item.perbaikanDocumentId || "");
        setPerbaikanFile(null);

        setBahanHabisVal(formatRupiah(item.bahanHabisValue || 0));
        setBahanHabisDocId(item.bahanHabisDocumentId || "");
        setBahanHabisFile(null);

        setPeralatanVal(formatRupiah(item.peralatanValue || 0));
        setPeralatanDocId(item.peralatanDocumentId || "");
        setPeralatanFile(null);

        setPelatihanVal(formatRupiah(item.pelatihanValue || 0));
        setPelatihanDocId(item.pelatihanDocumentId || "");
        setPelatihanFile(null);

        setMeubelairVal(formatRupiah(item.meubelairValue || 0));
        setMeubelairDocId(item.meubelairDocumentId || "");
        setMeubelairFile(null);

        setOpenModal(true);
    };

    const handleOpenDelete = (item: TUnitBudgetProposal) => {
        setSelectedProposal(item);
        setOpenDelete(true);
    };

    const handleTemplateDownload = async (type: TemplateType) => {
        try {
            const blob = await downloadTemplate(type);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Template_${type}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            enqueueSnackbar(`Berhasil mengunduh template ${type}`, { variant: "success" });
        } catch {
            enqueueSnackbar(`Gagal mengunduh template ${type}`, { variant: "error" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formUnitId) {
            enqueueSnackbar("Pilih Unit terlebih dahulu", { variant: "warning" });
            return;
        }
        if (!formYear || formYear < 2000) {
            enqueueSnackbar("Masukkan tahun yang valid", { variant: "warning" });
            return;
        }

        try {
            setIsUploading(true);

            let finalPerbaikanDocId = perbaikanDocId;
            if (perbaikanFile) {
                finalPerbaikanDocId = await uploadProkerDocument(perbaikanFile, "PROPOSAL");
            }

            let finalBahanHabisDocId = bahanHabisDocId;
            if (bahanHabisFile) {
                finalBahanHabisDocId = await uploadProkerDocument(bahanHabisFile, "PROPOSAL");
            }

            let finalPeralatanDocId = peralatanDocId;
            if (peralatanFile) {
                finalPeralatanDocId = await uploadProkerDocument(peralatanFile, "PROPOSAL");
            }

            let finalPelatihanDocId = pelatihanDocId;
            if (pelatihanFile) {
                finalPelatihanDocId = await uploadProkerDocument(pelatihanFile, "PROPOSAL");
            }

            let finalMeubelairDocId = meubelairDocId;
            if (meubelairFile) {
                finalMeubelairDocId = await uploadProkerDocument(meubelairFile, "PROPOSAL");
            }

            const payload = {
                perbaikanDocumentId: finalPerbaikanDocId || null,
                perbaikanValue: parseRupiahNumber(perbaikanVal),
                bahanHabisDocumentId: finalBahanHabisDocId || null,
                bahanHabisValue: parseRupiahNumber(bahanHabisVal),
                peralatanDocumentId: finalPeralatanDocId || null,
                peralatanValue: parseRupiahNumber(peralatanVal),
                pelatihanDocumentId: finalPelatihanDocId || null,
                pelatihanValue: parseRupiahNumber(pelatihanVal),
                meubelairDocumentId: finalMeubelairDocId || null,
                meubelairValue: parseRupiahNumber(meubelairVal),
            };

            saveMutation.mutate(
                { unitId: formUnitId, year: formYear, payload },
                {
                    onSuccess: () => {
                        enqueueSnackbar("Usulan anggaran berhasil disimpan", { variant: "success" });
                        setOpenModal(false);
                    },
                    onError: (err: unknown) => {
                        const error = err as { response?: { data?: { message?: string } } };
                        enqueueSnackbar(
                            error?.response?.data?.message || "Gagal menyimpan usulan anggaran",
                            { variant: "error" }
                        );
                    },
                }
            );
        } catch {
            enqueueSnackbar("Gagal mengunggah dokumen usulan", { variant: "error" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = () => {
        if (selectedProposal) {
            const targetUnitId = selectedProposal.unitId || selectedProposal.unit?.id;
            if (!targetUnitId) {
                enqueueSnackbar("ID Unit tidak valid", { variant: "error" });
                return;
            }
            deleteMutation.mutate(
                { unitId: targetUnitId, year: selectedProposal.year },
                {
                    onSuccess: () => {
                        enqueueSnackbar("Usulan anggaran berhasil dihapus", { variant: "success" });
                        setOpenDelete(false);
                    },
                    onError: (err: unknown) => {
                        const error = err as { response?: { data?: { message?: string } } };
                        enqueueSnackbar(
                            error?.response?.data?.message || "Gagal menghapus usulan anggaran",
                            { variant: "error" }
                        );
                    },
                }
            );
        }
    };

    const items = query.data?.data?.items || [];
    const pagination = query.data?.data?.pagination || {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
    };

    const grandTotal = items.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);

    const rows: TRow[] = items.map((item) => ({
        ...item,
        rowId: `${item.unitId}-${item.year}`,
    }));

    const columns = getProposalColumns({
        getUnitName,
        onPreviewDoc: setPreviewDoc,
        onEdit: handleOpenEdit,
        onDelete: handleOpenDelete,
    });

    const isPending = saveMutation.isPending || deleteMutation.isPending || isUploading;

    return (
        <Page
            breadcrumbs={[
                {
                    label: "Usulan Anggaran User",
                    path: "/proker/usulanAnggaranUser",
                },
            ]}
            topPage={
                <Filter
                    variants={["search"]}
                    labelSearch={"Cari Unit atau Usulan..."}
                    defaultValue={{
                        search_value: filters.search || filters.search_value,
                    }}
                />
            }
        >
            <Stack spacing={3}>
                {/* ── Summary Stats Section ── */}
                <SummaryCards
                    grandTotal={grandTotal}
                    totalItems={pagination.totalItems || items.length}
                    onTemplateDownload={handleTemplateDownload}
                />

                {/* ── Table Header Controls ── */}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" gap={2}>
                    <Typography variant="h6" fontWeight={700}>
                        Daftar Usulan Anggaran Unit
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddOutlined />}
                        onClick={handleOpenAdd}
                        sx={{ fontWeight: 700, borderRadius: "8px" }}
                    >
                        Tambah Usulan Anggaran
                    </Button>
                </Stack>

                {/* ── Data Table ── */}
                <DataTable
                    loading={query.isLoading}
                    rows={rows}
                    getRowId={(row) => row.rowId}
                    columns={columns}
                    paginationInfo={createPaginationInfo({
                        per_page: pagination.limit || 10,
                        total: pagination.totalItems || 0,
                        page: pagination.page || 1,
                    })}
                    handleChange={setFilter}
                />
            </Stack>

            {/* ─── Dialog Form (Tambah / Edit Usulan Anggaran) ────────────────────────── */}
            <ProposalFormDialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                selectedProposal={selectedProposal}
                formUnitId={formUnitId}
                setFormUnitId={setFormUnitId}
                formYear={formYear}
                setFormYear={setFormYear}
                availableUnits={availableUnits}
                isPending={isPending}
                handleSubmit={handleSubmit}
                onTemplateDownload={handleTemplateDownload}
                perbaikanVal={perbaikanVal}
                setPerbaikanVal={setPerbaikanVal}
                perbaikanFile={perbaikanFile}
                setPerbaikanFile={setPerbaikanFile}
                perbaikanDocId={perbaikanDocId}
                bahanHabisVal={bahanHabisVal}
                setBahanHabisVal={setBahanHabisVal}
                bahanHabisFile={bahanHabisFile}
                setBahanHabisFile={setBahanHabisFile}
                bahanHabisDocId={bahanHabisDocId}
                peralatanVal={peralatanVal}
                setPeralatanVal={setPeralatanVal}
                peralatanFile={peralatanFile}
                setPeralatanFile={setPeralatanFile}
                peralatanDocId={peralatanDocId}
                pelatihanVal={pelatihanVal}
                setPelatihanVal={setPelatihanVal}
                pelatihanFile={pelatihanFile}
                setPelatihanFile={setPelatihanFile}
                pelatihanDocId={pelatihanDocId}
                meubelairVal={meubelairVal}
                setMeubelairVal={setMeubelairVal}
                meubelairFile={meubelairFile}
                setMeubelairFile={setMeubelairFile}
                meubelairDocId={meubelairDocId}
            />

            {/* ─── Dialog Hapus ───────────────────────────────────────── */}
            <DeleteProposalDialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                selectedProposal={selectedProposal}
                isPending={isPending}
                onConfirm={handleDelete}
            />

            {/* ─── Document Preview Modal ────────────────────────────── */}
            {previewDoc && (
                <DocumentPreviewModal
                    open={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    title={previewDoc.title}
                    document={previewDoc.url}
                />
            )}
        </Page>
    );
}
