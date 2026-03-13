import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Grid, Paper } from "@mui/material";
import useTestFormula from "../_hooks/use-test-formula";
import useGetListFormulaComponent from "../_hooks/use-get-list-formula-component";
import { TIKUFormulaComponentItem } from "@/api/master/iku/type";

type ModalTestFormulaProps = {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formula: any | null;
};

type TestInput = {
    key: string;
    value: string;
};


const ModalTestFormula = ({ open, onClose, formula }: ModalTestFormulaProps) => {
    const [inputs, setInputs] = useState<TestInput[]>([]);
    const testFormulaMutation = useTestFormula();
    const componentQuery = useGetListFormulaComponent(formula?.id);

    useEffect(() => {
        if (open) {
            if (componentQuery.data?.data) {
                // If the API returns an array of strings
                const components: TIKUFormulaComponentItem[] = componentQuery?.data?.data?.components || [];
                setInputs(components?.map(comp => ({ key: comp?.code || '', value: '' })));
            } else {
                setInputs([]);
            }
        }
    }, [open, componentQuery.data]);

    const handleClose = () => {
        setInputs([]);
        onClose();
    };

    const handleInputChange = (index: number, field: keyof TestInput, val: string) => {
        const newInputs = [...inputs];
        newInputs[index][field] = val;
        setInputs(newInputs);
    };

    const handleTest = () => {
        if (!formula?.id) return;

        const componentValues: Record<string, number> = {};
        inputs.forEach(input => {
            if (input.key.trim()) {
                componentValues[input.key.trim()] = Number(input.value) || 0;
            }
        });

        testFormulaMutation.mutate({
            id: formula.id,
            req: { componentValues }
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Detail & Test Formula</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Detail Data Formula */}
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Data Formula</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="textSecondary">ID</Typography>
                                <Typography variant="body2">{formula?.id || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="textSecondary">Nama</Typography>
                                <Typography variant="body2">{formula?.name || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="textSecondary">Final Result Key</Typography>
                                <Typography variant="body2">{formula?.finalResultKey || '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="textSecondary">Status</Typography>
                                <Typography variant="body2">{formula?.isActive ? 'Aktif' : 'Tidak Aktif'}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Form Testing */}
                    <Box>
                        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">Test Component Values</Typography>
                        </Box>

                        {componentQuery.isLoading && <Typography>Loading components...</Typography>}

                        {!componentQuery.isLoading && inputs.length === 0 && (
                            <Typography color="textSecondary">Tidak ada variabel komponen yang diperlukan.</Typography>
                        )}

                        {!componentQuery.isLoading && inputs.map((input, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Component Key"
                                    size="small"
                                    value={input.key}
                                    disabled
                                    fullWidth
                                />
                                <TextField
                                    label="Value"
                                    type="number"
                                    size="small"
                                    value={input.value}
                                    onChange={(e) => handleInputChange(index, "value", e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        ))}
                        {testFormulaMutation.data?.data?.result != null && (
                            <Typography variant="body2">Hasil: {testFormulaMutation.data?.data?.result}</Typography>
                        )}
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Tutup</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTest}
                    disabled={testFormulaMutation.isPending || !formula?.id}
                >
                    {testFormulaMutation.isPending ? "Testing..." : "Test Endpoint"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalTestFormula;
