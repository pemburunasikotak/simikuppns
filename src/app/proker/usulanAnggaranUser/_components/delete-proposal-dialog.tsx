import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Typography,
    Button,
} from "@mui/material";
import { TUnitBudgetProposal } from "@/api/proker/usulanAnggaran/type";

interface DeleteProposalDialogProps {
    open: boolean;
    onClose: () => void;
    selectedProposal: TUnitBudgetProposal | null;
    isPending: boolean;
    onConfirm: () => void;
}

export const DeleteProposalDialog: React.FC<DeleteProposalDialogProps> = ({
    open,
    onClose,
    selectedProposal,
    isPending,
    onConfirm,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}
        >
            <DialogTitle sx={{ fontWeight: 800, color: "error.main" }}>
                Hapus Usulan Anggaran
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Typography>
                    Apakah Anda yakin ingin menghapus Usulan Anggaran tahun{" "}
                    <strong>{selectedProposal?.year}</strong> untuk unit ini? Tindakan ini tidak dapat
                    dibatalkan.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700, color: "text.secondary" }}>
                    Batal
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={isPending}
                    onClick={onConfirm}
                    sx={{ fontWeight: 700 }}
                >
                    {isPending ? "Menghapus..." : "Hapus"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
