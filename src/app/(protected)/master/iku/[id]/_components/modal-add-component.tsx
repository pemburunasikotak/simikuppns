import { useState, SyntheticEvent, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Box } from "@mui/material";
import { useParams } from "react-router";
import useCreateComponent from "../_hooks/use-create-component";
import { getListComponent } from "@/api/master/component";
import { TComponentItem } from "@/api/master/component/type";

type ModalAddComponentProps = {
    open: boolean;
    onClose: () => void;
};

const ModalAddComponent = ({ open, onClose }: ModalAddComponentProps) => {
    const params = useParams();
    const [options, setOptions] = useState<TComponentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<TComponentItem | null>(null);

    const createComponent = useCreateComponent();

    useEffect(() => {
        if (open) {
            fetchComponents();
        } else {
            setSelectedComponent(null);
        }
    }, [open]);

    const fetchComponents = async () => {
        setLoading(true);
        try {
            // Fetch all components
            const res = await getListComponent({ limit: 100, page: 1 });
            setOptions(res.result?.data || []);
        } catch (error) {
            console.error("Failed to fetch components", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (!selectedComponent || !params.id) return;

        createComponent.mutate({
            params: { id: params.id },
            req: { id: selectedComponent.id }
        }, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Tambah Komponen</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1, minHeight: 150 }}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => `${option.code} - ${option.name}`}
                        loading={loading}
                        value={selectedComponent}
                        onChange={(_: SyntheticEvent, newValue: TComponentItem | null) => {
                            setSelectedComponent(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Pilih Komponen"
                                variant="outlined"
                                autoFocus
                            />
                        )}
                        noOptionsText="Tidak ada komponen ditemukan"
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Batal
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!selectedComponent || createComponent.isPending}
                >
                    {createComponent.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalAddComponent;
