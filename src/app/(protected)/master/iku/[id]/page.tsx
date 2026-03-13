import { useParams } from "react-router";
import { GridColDef } from "@mui/x-data-grid";
import { Typography, Box, Paper } from "@mui/material";
import { Button, Grid } from "@mui/material";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { paths } from "@/commons/constants/paths";

import useGetDetailIKU from "./_hooks/use-get-detail-iku";
import useGetListComponent from "./_hooks/use-get-list-component";
import { TIKUComponentItem } from "@/api/master/iku/type";
import { createPaginationInfo } from "@/utils/data-table";
import { Add, DeleteOutlined } from "@mui/icons-material";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import useDeleteComponent from "./_hooks/use-delete-component";
import ModalAddComponent from "./_components/modal-add-component";
import ModalAddFormula from "./_components/modal-add-formula";
import ModalTestFormula from "./_components/modal-test-formula";
import { useState } from "react";
import useGetListFormula from "./_hooks/use-get-list-formula";
import useDeleteFormula from "./_hooks/use-delete-formula";

const IKUDetailPage = () => {
    const params = useParams();

    const idIku = params.id;
    const detailQuery = useGetDetailIKU({ id: params.id! });
    const componentQuery = useGetListComponent({ id: params.id! });
    const formulaQuery = useGetListFormula({ ikuId: params.id! });

    const deleteComponent = useDeleteComponent();
    const deleteFormula = useDeleteFormula();

    const modal = useModal();

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openAddModalFormula, setOpenAddModalFormula] = useState(false);
    const [openTestModalFormula, setOpenTestModalFormula] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedTestFormula, setSelectedTestFormula] = useState<any>(null);

    const ikuInfo = detailQuery.data?.result;

    const columns: GridColDef<TIKUComponentItem>[] = [
        { field: "code", headerName: "Kode Komponen", width: 150 },
        { field: "name", headerName: "Nama Komponen", minWidth: 200, flex: 0.5 },
        { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
        { field: "dataType", headerName: "Tipe Data", width: 150 },
        { field: "sourceType", headerName: "Sumber Data", width: 150 },
        {
            field: "actions",
            headerName: "Action",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionButtonTable
                    items={[
                        {
                            key: "delete",
                            type: "delete",
                            onClick: () => {
                                modal.confirm({
                                    icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                                    description: "Apakah kamu akan menghapus data ini ?",
                                    onOk: () => {
                                        deleteComponent.mutate({ ikuId: idIku!, componentId: params.row.id });
                                    },
                                });
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    const columnsFormula: GridColDef<TIKUComponentItem>[] = [
        { field: "id", headerName: "ID", width: 150 },
        { field: "ikuId", headerName: "IKU ID", minWidth: 200, flex: 0.5 },
        { field: "name", headerName: "Nama", minWidth: 250, flex: 1 },
        { field: "description", headerName: "Deskripsi", width: 150 },
        { field: "finalResultKey", headerName: "Final Result Key", width: 150 },
        { field: "isActive", headerName: "Aktif", width: 150 },
        {
            field: "actions",
            headerName: "Action",
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionButtonTable
                    items={[
                        {
                            key: "detail",
                            type: "detail",
                            onClick: () => {
                                setSelectedTestFormula(params.row);
                                setOpenTestModalFormula(true);
                            }
                        },
                        {
                            key: "delete",
                            type: "delete",
                            onClick: () => {
                                modal.confirm({
                                    icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                                    description: "Apakah kamu akan menghapus data ini ?",
                                    onOk: () => {
                                        deleteFormula.mutate({ id: params.row.id });
                                    },
                                });
                            },
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <Page
            loading={detailQuery.isLoading}
            title="Detail IKU"
            breadcrumbs={[
                {
                    label: "Master Data",
                    path: paths.master.iku.list,
                },
                {
                    label: "IKU",
                    path: paths.master.iku.list,
                },
                {
                    label: "Detail",
                    path: null,
                },
            ]}
        >
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Informasi IKU
                        </Typography>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Kode IKU
                            </Typography>
                            <Typography variant="body1">{ikuInfo?.code || "-"}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Nama IKU
                            </Typography>
                            <Typography variant="body1">{ikuInfo?.name || "-"}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Deskripsi
                            </Typography>
                            <Typography variant="body1">{ikuInfo?.description || "-"}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" gutterBottom ml={1}>
                            Daftar IKP
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={() => setOpenAddModal(true)}
                        >
                            Tambah IKP
                        </Button>
                    </Box>
                    <DataTable
                        loading={componentQuery.isLoading}
                        rows={componentQuery?.data?.result?.data || []}
                        columns={columns}
                        checkboxSelection
                        paginationInfo={createPaginationInfo({
                            per_page: 10,
                            total: componentQuery.data?.result?.total || 0,
                            page: componentQuery.data?.result?.currentPage || 1,
                        })}
                        handleChange={() => { }}
                        onRowSelectionModelChange={(ids) => {
                            console.log('CEK ID', ids)
                        }}
                    />
                </Grid>
            </Grid>
            <ModalAddComponent
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
            />

            <Grid size={{ xs: 12 }} mt={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" gutterBottom ml={1}>
                        Daftar Formula
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => setOpenAddModalFormula(true)}
                    >
                        Tambah Formula
                    </Button>
                </Box>
                <DataTable
                    loading={formulaQuery.isLoading}
                    rows={formulaQuery?.data?.result?.data || []}
                    columns={columnsFormula}
                    checkboxSelection
                    paginationInfo={createPaginationInfo({
                        per_page: 10,
                        total: formulaQuery.data?.result?.total || 0,
                        page: formulaQuery.data?.result?.currentPage || 1,
                    })}
                    handleChange={() => { }}
                    onRowSelectionModelChange={(ids) => {
                        console.log('CEK ID', ids)
                    }}
                />
            </Grid>
            <ModalAddFormula
                open={openAddModalFormula}
                onClose={() => setOpenAddModalFormula(false)}
                master={componentQuery.data?.result?.data || []}
            />

            <ModalTestFormula
                open={openTestModalFormula}
                onClose={() => setOpenTestModalFormula(false)}
                formula={selectedTestFormula}
            />
        </Page>
    );
};

export default IKUDetailPage;
