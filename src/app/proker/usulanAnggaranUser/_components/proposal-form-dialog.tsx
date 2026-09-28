import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Divider,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { TUnitBudgetProposal } from "@/api/proker/usulanAnggaran/type";
import { TemplateType } from "@/api/proker/program/api";
import { CategoryInputCard } from "./category-input-card";

interface ProposalFormDialogProps {
    open: boolean;
    onClose: () => void;
    selectedProposal: TUnitBudgetProposal | null;
    formUnitId: string;
    setFormUnitId: (val: string) => void;
    formYear: number;
    setFormYear: (val: number) => void;
    availableUnits: Array<{ id: string; name: string }>;
    isPending: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    onTemplateDownload: (type: TemplateType) => void;

    // Perbaikan
    perbaikanVal: string;
    setPerbaikanVal: (val: string) => void;
    perbaikanFile: File | null;
    setPerbaikanFile: (file: File | null) => void;
    perbaikanDocId: string;

    // Bahan Habis
    bahanHabisVal: string;
    setBahanHabisVal: (val: string) => void;
    bahanHabisFile: File | null;
    setBahanHabisFile: (file: File | null) => void;
    bahanHabisDocId: string;

    // Peralatan
    peralatanVal: string;
    setPeralatanVal: (val: string) => void;
    peralatanFile: File | null;
    setPeralatanFile: (file: File | null) => void;
    peralatanDocId: string;

    // Pelatihan
    pelatihanVal: string;
    setPelatihanVal: (val: string) => void;
    pelatihanFile: File | null;
    setPelatihanFile: (file: File | null) => void;
    pelatihanDocId: string;

    // Meubelair
    meubelairVal: string;
    setMeubelairVal: (val: string) => void;
    meubelairFile: File | null;
    setMeubelairFile: (file: File | null) => void;
    meubelairDocId: string;
}

export const ProposalFormDialog: React.FC<ProposalFormDialogProps> = ({
    open,
    onClose,
    selectedProposal,
    formUnitId,
    setFormUnitId,
    formYear,
    setFormYear,
    availableUnits,
    isPending,
    handleSubmit,
    onTemplateDownload,

    perbaikanVal,
    setPerbaikanVal,
    perbaikanFile,
    setPerbaikanFile,
    perbaikanDocId,

    bahanHabisVal,
    setBahanHabisVal,
    bahanHabisFile,
    setBahanHabisFile,
    bahanHabisDocId,

    peralatanVal,
    setPeralatanVal,
    peralatanFile,
    setPeralatanFile,
    peralatanDocId,

    pelatihanVal,
    setPelatihanVal,
    pelatihanFile,
    setPelatihanFile,
    pelatihanDocId,

    meubelairVal,
    setMeubelairVal,
    meubelairFile,
    setMeubelairFile,
    meubelairDocId,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 800 }}>
                    {selectedProposal ? "Edit Usulan Anggaran Unit" : "Tambah Usulan Anggaran Unit"}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={3} sx={{ pt: 1 }}>
                        {/* Top Unit & Year Controls */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 8 }}>
                                <FormControl fullWidth size="small" required>
                                    <InputLabel id="unit-select-label">Pilih Unit</InputLabel>
                                    <Select
                                        labelId="unit-select-label"
                                        label="Pilih Unit *"
                                        value={formUnitId}
                                        onChange={(e) => setFormUnitId(e.target.value)}
                                        disabled={!!selectedProposal}
                                    >
                                        {availableUnits.map((u) => (
                                            <MenuItem key={u.id} value={u.id}>
                                                {u.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Tahun"
                                    type="number"
                                    value={formYear}
                                    disabled={!!selectedProposal}
                                    onChange={(e) => setFormYear(Number(e.target.value))}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Divider />
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                            Rincian Usulan Anggaran Per Kategori:
                        </Typography>

                        {/* 1. Usulan Perbaikan */}
                        <CategoryInputCard
                            title="1. Usulan Perbaikan"
                            categoryLabel="Perbaikan"
                            templateType="FORMAT_USULAN_PERBAIKAN"
                            value={perbaikanVal}
                            onValueChange={setPerbaikanVal}
                            file={perbaikanFile}
                            onFileChange={setPerbaikanFile}
                            docId={perbaikanDocId}
                            onTemplateDownload={onTemplateDownload}
                        />

                        {/* 2. Usulan Bahan Habis */}
                        <CategoryInputCard
                            title="2. Usulan Bahan Habis"
                            categoryLabel="Bahan Habis"
                            templateType="FORMAT_USULAN_BAHAN_HABIS"
                            value={bahanHabisVal}
                            onValueChange={setBahanHabisVal}
                            file={bahanHabisFile}
                            onFileChange={setBahanHabisFile}
                            docId={bahanHabisDocId}
                            onTemplateDownload={onTemplateDownload}
                        />

                        {/* 3. Usulan Peralatan */}
                        <CategoryInputCard
                            title="3. Usulan Peralatan"
                            categoryLabel="Peralatan"
                            templateType="FORMAT_USULAN_PERALATAN"
                            value={peralatanVal}
                            onValueChange={setPeralatanVal}
                            file={peralatanFile}
                            onFileChange={setPeralatanFile}
                            docId={peralatanDocId}
                            onTemplateDownload={onTemplateDownload}
                        />

                        {/* 4. Usulan Pelatihan */}
                        <CategoryInputCard
                            title="4. Usulan Pelatihan"
                            categoryLabel="Pelatihan"
                            templateType="FORMAT_USULAN_PELATIHAN"
                            value={pelatihanVal}
                            onValueChange={setPelatihanVal}
                            file={pelatihanFile}
                            onFileChange={setPelatihanFile}
                            docId={pelatihanDocId}
                            onTemplateDownload={onTemplateDownload}
                        />

                        {/* 5. Usulan Meubelair */}
                        <CategoryInputCard
                            title="5. Usulan Meubelair"
                            categoryLabel="Meubelair"
                            templateType="FORMAT_USULAN_MEUBELAIR"
                            value={meubelairVal}
                            onValueChange={setMeubelairVal}
                            file={meubelairFile}
                            onFileChange={setMeubelairFile}
                            docId={meubelairDocId}
                            onTemplateDownload={onTemplateDownload}
                        />
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        sx={{ fontWeight: 700, px: 4 }}
                    >
                        {isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
