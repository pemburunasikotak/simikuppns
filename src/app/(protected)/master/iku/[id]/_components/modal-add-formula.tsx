import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControlLabel, Switch, Typography, IconButton, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useParams } from "react-router";
import useCreateFormula from "../_hooks/use-create-formula";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { TComponentItem } from "@/api/master/component/type";
import { enqueueSnackbar } from "notistack";

type ModalAddFormulaProps = {
    open: boolean;
    onClose: () => void;
    master: TComponentItem[];
};

type StepForm = {
    leftType: string;
    leftValue: string;
    operator: string;
    rightType: string;
    rightValue: string;
    resultKey: string;
};

const ModalAddFormula = ({ open, onClose, master }: ModalAddFormulaProps) => {
    const params = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [finalResultKey, setFinalResultKey] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [steps, setSteps] = useState<StepForm[]>([]);

    const createFormula = useCreateFormula();

    const handleReset = () => {
        setName("");
        setDescription("");
        setFinalResultKey("");
        setIsActive(true);
        setSteps([]);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleAddStep = () => {
        setSteps([...steps, {
            leftType: "component",
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

    const handleSubmit = () => {
        if (!params.id) return;

        const stepsResultKey = steps[steps.length - 1]?.resultKey;

        if (finalResultKey !== stepsResultKey) {
            enqueueSnackbar("Final result key tidak sesuai dengan result key terakhir", { variant: "error" });
            return;
        }
        createFormula.mutate({
            ikuId: params.id,
            name,
            description,
            finalResultKey,
            isActive,
            steps: steps.map((step, index) => ({
                ...step,
                sequence: index + 1
            }))
        }, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>Tambah Formula</DialogTitle>
            <DialogContent>
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
                                <IconButton size="small" color="error" onClick={() => handleRemoveStep(index)}>
                                    <DeleteOutlined fontSize="small" />
                                </IconButton>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 4, md: 2 }}>
                                    <TextField
                                        label="Left Type"
                                        size="small"
                                        fullWidth
                                        value={step.leftType}
                                        onChange={(e) => handleStepChange(index, "leftType", e.target.value)}
                                        placeholder="component / formula"
                                    />
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
                                            {index === 0 ? (
                                                master.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.code}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                steps.slice(0, index).map((prevStep, pIdx) => (
                                                    prevStep.resultKey ? (
                                                        <MenuItem key={pIdx} value={prevStep.resultKey}>
                                                            {prevStep.resultKey}
                                                        </MenuItem>
                                                    ) : null
                                                ))
                                            )}
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
                                                // Reset right value when type changes
                                                handleStepChange(index, "rightValue", "");
                                            }}
                                        >
                                            <MenuItem value="component">Component</MenuItem>
                                            <MenuItem value="constant">Constant</MenuItem>
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
                                                {master.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.code}
                                                    </MenuItem>
                                                ))}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">
                    Batal
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={createFormula.isPending || !name || !finalResultKey}
                >
                    {createFormula.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddFormula;
