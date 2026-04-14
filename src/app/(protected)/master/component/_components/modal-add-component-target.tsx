import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Grid } from "@mui/material";
import { useParams } from "react-router";
import useCreateComponentTarget from "../[id]/_hooks/use-create-component-target";
import useEditComponentTarget from "../[id]/_hooks/use-edit-component-target";
import { TComponentTargetItem } from "@/api/master/component/type";

type ModalAddComponentTargetProps = {
    open: boolean;
    onClose: () => void;
    target?: TComponentTargetItem | null;
    mode?: "add" | "edit" | "detail";
};

const ModalAddComponentTarget = ({ open, onClose, target, mode = "add" }: ModalAddComponentTargetProps) => {
    const params = useParams();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [targetQ1, setTargetQ1] = useState<number>(0);
    const [targetQ2, setTargetQ2] = useState<number>(0);
    const [targetQ3, setTargetQ3] = useState<number>(0);
    const [targetQ4, setTargetQ4] = useState<number>(0);
    const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());

    const createTarget = useCreateComponentTarget();
    const editTarget = useEditComponentTarget();

    useEffect(() => {
        if (target) {
            setYear(target.year);
            setTargetQ1(Number(target.targetQ1));
            setTargetQ2(Number(target.targetQ2));
            setTargetQ3(Number(target.targetQ3));
            setTargetQ4(Number(target.targetQ4));
            setTargetYear(Number(target.targetYear));
        } else {
            handleReset();
        }
    }, [target, open]);

    const handleReset = () => {
        setYear(new Date().getFullYear());
        setTargetQ1(0);
        setTargetQ2(0);
        setTargetQ3(0);
        setTargetQ4(0);
        setTargetYear(new Date().getFullYear());
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleSubmit = () => {
        if (!params.id) return;

        const payload = {
            componentId: params.id,
            year,
            targetQ1,
            targetQ2,
            targetQ3,
            targetQ4,
            targetYear,
        };

        if (mode === "edit" && target) {
            editTarget.mutate({ id: target.id, req: payload }, {
                onSuccess: () => {
                    handleClose();
                }
            });
        } else {
            createTarget.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    };

    const isDetail = mode === "detail";

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {mode === "edit" ? "Edit Target IKP" : mode === "detail" ? "Detail Target IKP" : "Tambah Target IKP"}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Tahun"
                        variant="outlined"
                        fullWidth
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        disabled={isDetail}
                        autoFocus={!isDetail && mode === "add"}
                    />
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Target Q1"
                                variant="outlined"
                                fullWidth
                                value={targetQ1}
                                onChange={(e) => setTargetQ1(Number(e.target.value))}
                                disabled={isDetail}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Target Q2"
                                variant="outlined"
                                fullWidth
                                value={targetQ2}
                                onChange={(e) => setTargetQ2(Number(e.target.value))}
                                disabled={isDetail}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Target Q3"
                                variant="outlined"
                                fullWidth
                                value={targetQ3}
                                onChange={(e) => setTargetQ3(Number(e.target.value))}
                                disabled={isDetail}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Target Q4"
                                variant="outlined"
                                fullWidth
                                value={targetQ4}
                                onChange={(e) => setTargetQ4(Number(e.target.value))}
                                disabled={isDetail}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Target Tahunan"
                        variant="outlined"
                        fullWidth
                        value={targetYear}
                        onChange={(e) => setTargetYear(Number(e.target.value))}
                        disabled={isDetail}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    {isDetail ? "Tutup" : "Batal"}
                </Button>
                {!isDetail && (
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={createTarget.isPending || editTarget.isPending}
                    >
                        {createTarget.isPending || editTarget.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddComponentTarget;
