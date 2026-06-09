import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import useGetListUser from "@/app/(protected)/user/_hooks/use-get-list-user";
import useAssignIKUPic from "../_hooks/use-assign-iku-pic";

type ModalAddPicProps = {
    open: boolean;
    onClose: () => void;
    ikuId: string;
    currentPicUserIds: string[];
};

const schema = z.object({
    userIds: z.array(z.string()).min(1, "Pilih minimal 1 PIC"),
});

type FormData = z.infer<typeof schema>;

const ModalAddPic = ({ open, onClose, ikuId, currentPicUserIds }: ModalAddPicProps) => {
    const assignPic = useAssignIKUPic();
    const usersQuery = useGetListUser({ limit: 1000, page: 1 });
    const users = usersQuery.data?.data || [];

    const { control, handleSubmit, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            userIds: [],
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                userIds: currentPicUserIds,
            });
        }
    }, [open, currentPicUserIds, reset]);

    const handleClose = () => {
        reset({ userIds: [] });
        onClose();
    };

    const onSubmit = (data: FormData) => {
        assignPic.mutate(
            {
                ikuId,
                req: { userIds: data.userIds },
            },
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.name} (${user.nip}) - ${user.type}`,
    }));

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 800 }}>Tambah / Kelola PIC IKU</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <FormDropdownCheckboxField
                            control={control}
                            name="userIds"
                            label="Pilih PIC"
                            placeholder="Pilih satu atau beberapa PIC"
                            options={userOptions}
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={assignPic.isPending || usersQuery.isLoading}
                        sx={{ fontWeight: 700 }}
                    >
                        {assignPic.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ModalAddPic;
