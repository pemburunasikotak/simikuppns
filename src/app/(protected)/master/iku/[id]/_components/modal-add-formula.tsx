import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControlLabel, Switch, Typography, IconButton, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useParams } from "react-router";
import useCreateFormula from "../_hooks/use-create-formula";
import useEditFormula from "../_hooks/use-edit-formula";
import useGetDetailFormula from "../_hooks/use-get-detail-formula";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { TComponentItem } from "@/api/master/component/type";
import { enqueueSnackbar } from "notistack";
import { TIKUComponentItem, TIKUFormulaStepCreateRequest } from "@/api/master/iku/type";

type ModalAddFormulaProps = {
    open: boolean;
    onClose: () => void;
    master: TComponentItem[];
    formulas: TIKUComponentItem[];
    formulaId?: string | null;
    idIku?: string | null;
};

type StepForm = {
    leftType: string;
    leftValue: string;
    operator: string;
    rightType: string;
    rightValue: string;
    resultKey: string;
};

const initialStep: StepForm = {
    leftType: "component",
    leftValue: "",
    operator: "ADD",
    rightType: "component",
    rightValue: "",
    resultKey: ""
};

const ModalAddFormula = ({ open, onClose, master, formulas, formulaId, idIku }: ModalAddFormulaProps) => {

    console.log('CEK ID', idIku)
    const params = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [finalResultKey, setFinalResultKey] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFinal, setIsFinal] = useState(false);
    const [steps, setSteps] = useState<StepForm[]>([initialStep]);
    const createFormula = useCreateFormula();
    const editFormulaMutation = useEditFormula();
    const detailQuery = useGetDetailFormula(formulaId || undefined);
    const detailData = detailQuery.data?.result;

    const handleReset = useCallback(() => {
        setName("");
        setDescription("");
        setFinalResultKey("");
        setIsActive(true);
        setIsFinal(false);
        setSteps([initialStep]);
    }, []);

    useEffect(() => {
        if (open) {
            if (formulaId) {
                if (detailData) {
                    setName(detailData.name || "");
                    setDescription(detailData.description || "");
                    setFinalResultKey(detailData.finalResultKey || "");
                    setIsActive(detailData.isActive !== false);
                    setIsFinal(detailData.isFinal === true);
                    if (detailData.steps && detailData.steps.length > 0) {
                        setSteps(detailData.steps.map((s: TIKUFormulaStepCreateRequest) => ({
                            leftType: s.leftType || "component",
                            leftValue: s.leftValue || "",
                            operator: s.operator || "ADD",
                            rightType: s.rightType || "component",
                            rightValue: s.rightValue || "",
                            resultKey: s.resultKey || ""
                        })));
                    } else {
                        setSteps([initialStep]);
                    }
                }
            } else {
                handleReset();
            }
        }
    }, [open, formulaId, detailData, handleReset]);

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleAddStep = () => {
        setSteps([...steps, {
            leftType: steps.length >= 1 ? "temp" : "component",
            leftValue: "",
            operator: "ADD",
            rightType: "component",
            rightValue: "",
            resultKey: ""
        }]);
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = [...steps];
        newSteps.splice(index, 1);
        setSteps(newSteps);
    };

    const handleStepChange = (index: number, field: keyof StepForm, value: string) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const renderValueOptions = (type: string, index: number) => {
        switch (type) {
            case 'component':
                return master.map((item) => (
                    <MenuItem key={item.id} value={item.code}>
                        {item.code}
                    </MenuItem>
                ));
            case 'formula_ref':
                return formulas.map((item) => (
                    <MenuItem key={item.id} value={item.finalResultKey}>
                        {item.name}
                    </MenuItem>
                ));
            case 'temp':
            default:
                return steps.slice(0, index).map((prevStep, pIdx) => (
                    prevStep.resultKey ? (
                        <MenuItem key={`step-${pIdx}`} value={prevStep.resultKey}>
                            {prevStep.resultKey}
                        </MenuItem>
                    ) : null
                ));
        }
    };

    const handleSubmit = () => {
        if (!params.id) return;

        const stepsResultKey = steps[steps.length - 1]?.resultKey;

        if (finalResultKey !== stepsResultKey) {
            enqueueSnackbar("Final result key tidak sesuai dengan result key terakhir", { variant: "error" });
            return;
        }
        const payload = {
            ikuId: formulaId ? undefined : params.id,
            name,
            description,
            finalResultKey,
            isActive,
            isFinal,
            steps: steps.map((step, index) => ({
                ...step,
                sequence: index + 1
            }))
        };

        if (formulaId) {
            editFormulaMutation.mutate({
                // id: String(idIku),
                id: formulaId,
                req: payload
            }, {
                onSuccess: () => {
                    handleClose();
                }
            });
        } else {
            createFormula.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                }
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>{formulaId ? "Edit Formula" : "Tambah Formula"}</DialogTitle>
            <DialogContent>
                {detailQuery.isLoading ? (
                    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                        <Typography>Memuat detail formula...</Typography>
                    </Box>
                ) : (
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nama"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <TextField
                            label="Deskripsi"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            label="Final Result Key"
                            variant="outlined"
                            fullWidth
                            value={finalResultKey}
                            onChange={(e) => setFinalResultKey(e.target.value)}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Aktif"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isFinal}
                                        onChange={(e) => setIsFinal(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Final"
                            />
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">Steps Kalkulasi</Typography>
                            <Button variant="outlined" size="small" startIcon={<Add />} onClick={handleAddStep}>
                                Tambah Step
                            </Button>
                        </Box>

                        {steps.map((step, index) => (
                            <Box key={index} sx={{ p: 2, border: "1px dashed grey", borderRadius: 1, position: "relative" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                    <Typography variant="subtitle2">Step {index + 1}</Typography>
                                    {steps.length > 1 && (
                                        <IconButton size="small" color="error" onClick={() => handleRemoveStep(index)}>
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`left-type-label-${index}`}>Left Type</InputLabel>
                                            <Select
                                                labelId={`left-type-label-${index}`}
                                                value={step.leftType}
                                                label="Left Type"
                                                onChange={(e) => handleStepChange(index, "leftType", e.target.value)}
                                                size="small"
                                                fullWidth
                                            >
                                                <MenuItem value="component">Component</MenuItem>
                                                <MenuItem value="temp">Temp</MenuItem>
                                                <MenuItem value="formula_ref">Formula</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`left-value-label-${index}`}>Left Value</InputLabel>
                                            <Select
                                                labelId={`left-value-label-${index}`}
                                                value={step.leftValue}
                                                label="Left Value"
                                                onChange={(e) => handleStepChange(index, "leftValue", e.target.value)}
                                            >
                                                {renderValueOptions(step.leftType, index)}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
                                            <Select
                                                labelId={`operator-label-${index}`}
                                                value={step.operator}
                                                label="Operator"
                                                onChange={(e) => handleStepChange(index, "operator", e.target.value)}
                                            >
                                                <MenuItem value="ADD">ADD (+)</MenuItem>
                                                <MenuItem value="SUB">SUB (-)</MenuItem>
                                                <MenuItem value="MUL">MUL (*)</MenuItem>
                                                <MenuItem value="DIV">DIV (/)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel id={`right-type-label-${index}`}>Right Type</InputLabel>
                                            <Select
                                                labelId={`right-type-label-${index}`}
                                                value={step.rightType || "component"}
                                                label="Right Type"
                                                onChange={(e) => {
                                                    handleStepChange(index, "rightType", e.target.value);
                                                    handleStepChange(index, "rightValue", "");
                                                }}
                                            >
                                                <MenuItem value="component">Component</MenuItem>
                                                <MenuItem value="constant">Constant</MenuItem>
                                                <MenuItem value="formula_ref">Formula</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        {step.rightType === "constant" ? (
                                            <TextField
                                                label="Right Value"
                                                size="small"
                                                fullWidth
                                                value={step.rightValue}
                                                onChange={(e) => handleStepChange(index, "rightValue", e.target.value)}
                                            />
                                        ) : (
                                            <FormControl fullWidth size="small">
                                                <InputLabel id={`right-value-label-${index}`}>Right Value</InputLabel>
                                                <Select
                                                    labelId={`right-value-label-${index}`}
                                                    value={step.rightValue}
                                                    label="Right Value"
                                                    onChange={(e) => handleStepChange(index, "rightValue", e.target.value)}
                                                >
                                                    {renderValueOptions(step.rightType, index)}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                        <TextField
                                            label="Result Key"
                                            size="small"
                                            fullWidth
                                            value={step.resultKey}
                                            onChange={(e) => handleStepChange(index, "resultKey", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}

                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Batal
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={createFormula.isPending || editFormulaMutation.isPending || !name || !finalResultKey}
                >
                    {createFormula.isPending || editFormulaMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddFormula;
