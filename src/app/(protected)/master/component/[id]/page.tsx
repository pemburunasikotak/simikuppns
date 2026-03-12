import { generatePath, useNavigate, useParams } from "react-router";
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

const IKUDetailPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const detailQuery = useGetDetailIKU({ id: params.id! });
    const componentQuery = useGetListComponent({ id: params.id! });

    const deleteComponent = useDeleteComponent();

    const modal = useModal();

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
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <ActionButtonTable
                    items={[
                        {
                            key: "detail",
                            type: "detail",
                            onClick: () =>
                                navigate(generatePath(paths.master.iku.detail, { id: params.row.id })),
                        },
                        {
                            key: "edit",
                            type: "edit",
                            onClick: () =>
                                navigate(generatePath(paths.master.iku.edit, { id: params.row.id })),
                        },
                        {
                            key: "delete",
                            type: "delete",
                            onClick: () => {
                                modal.confirm({
                                    icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                                    description: "Apakah kamu akan menghapus data ini ?",
                                    onOk: () => {
                                        deleteComponent.mutate({ id: params.row.id });
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
            title="Detail Component"
            breadcrumbs={[
                {
                    label: "Master Data",
                    path: paths.master.component.list,
                },
                {
                    label: "Component",
                    path: paths.master.component.list,
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
                            Informasi Component
                        </Typography>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Kode Component
                            </Typography>
                            <Typography variant="body1">{ikuInfo?.code || "-"}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Nama Component
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
                            Daftar Komponen
                        </Typography>
                        <Button variant="outlined" size="small" startIcon={<Add />}>
                            Tambah Komponen
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
        </Page>
    );
};

export default IKUDetailPage;
