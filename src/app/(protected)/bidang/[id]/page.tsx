import { useState, useMemo } from "react";
import { useParams } from "react-router";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography, Box, Paper, Button, Grid, Tab, Tabs, Divider } from "@mui/material";
import { Add, DeleteOutlined } from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
// import { SessionUser } from "@/libs/localstorage";
import { paths } from "@/commons/constants/paths";
import { TBidangUserAssignment, TBidangIkuAssignment, TBidangComponentAssignment } from "@/api/bidang/type";

import useGetDetailBidang from "./_hooks/use-get-detail-bidang";
import useGetBidangUsers from "./_hooks/use-get-bidang-users";
import useGetBidangIkus from "./_hooks/use-get-bidang-ikus";
import useGetBidangComponents from "./_hooks/use-get-bidang-components";
import useUnassignUser from "./_hooks/use-unassign-user";
import useUnassignIku from "./_hooks/use-unassign-iku";
import useUnassignComponent from "./_hooks/use-unassign-component";

import ModalAssignUser from "./_components/modal-assign-user";
import ModalAssignIku from "./_components/modal-assign-iku";
import ModalAssignComponent from "./_components/modal-assign-component";

const BidangDetailPage = () => {
  const params = useParams();
  // const navigate = useNavigate();
  const modal = useModal();
  const idBidang = params.id!;

  const [activeTab, setActiveTab] = useState(0);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openIkuModal, setOpenIkuModal] = useState(false);
  const [openComponentModal, setOpenComponentModal] = useState(false);

  // Authentication & Role Check
  // const sessionUser = SessionUser.get();
  // const user = sessionUser?.user ?? {};
  // const userRoleKeys = useMemo(() => user?.roles?.map((r: any) => r.key) || [], [user?.roles]);
  // const userRoleKeys = useMemo(() => user?.roles?.map((r: any) => r.key) || [], [user?.roles]);
  const isAdmin = true

  // Queries & Mutations
  const detailQuery = useGetDetailBidang(idBidang);
  const usersQuery = useGetBidangUsers(idBidang);
  const ikusQuery = useGetBidangIkus(idBidang);
  const componentsQuery = useGetBidangComponents(idBidang);

  const unassignUserMutation = useUnassignUser(idBidang);
  const unassignIkuMutation = useUnassignIku(idBidang);
  const unassignComponentMutation = useUnassignComponent(idBidang);


  const bidangInfo = detailQuery.data?.result;

  // Map users assigned to Bidang from GET /api/bidang/{id}/users
  const mappedUsers = useMemo(() => {
    const assigned = usersQuery.data?.data?.assignments || [];
    return assigned.map((item: TBidangUserAssignment) => ({
      id: item.id,
      userId: item.userId,
      createdAt: item.createdAt,
      name: item.user?.name || "-",
      nip: item.user?.nip || "-",
      email: item.user?.email || "-",
      type: item.user?.type || "-",
    }));
  }, [usersQuery.data]);


  // Map IKUs assigned to Bidang from GET /api/bidang/{id}/ikus
  const mappedIkus = useMemo(() => {
    const dataObj = ikusQuery.data?.data;
    const assigned = dataObj?.ikus || [];
    return assigned.map((item: TBidangIkuAssignment) => ({
      id: item.id,
      ikuId: item.ikuId,
      createdAt: item.createdAt,
      code: item.iku?.code || "-",
      name: item.iku?.name || "-",
      unit: item.iku?.unit || "-",
      isDirectInput: item.iku?.isDirectInput ? "Ya" : "Tidak",
    }));
  }, [ikusQuery.data]);

  // Map Components assigned to Bidang from GET /api/bidang/{id}/components
  const mappedComponents = useMemo(() => {
    const dataObj = componentsQuery.data?.data;
    const assigned = dataObj?.components || [];
    return assigned.map((item: TBidangComponentAssignment) => ({
      id: item.id,
      componentId: item.componentId,
      createdAt: item.createdAt,
      code: item.component?.code || "-",
      name: item.component?.name || "-",
      dataType: item.component?.dataType || "-",

      sourceType: item.component?.sourceType || "-",
      periodType: item.component?.periodType || "-",
      hasBreakdown: item.component?.hasBreakdown ? "Ya" : "Tidak",
    }));
  }, [componentsQuery.data]);


  // DataGrid Columns definition
  const columnsUser: GridColDef[] = [
    { field: "nip", headerName: "NIP", width: 150 },
    { field: "name", headerName: "Nama PIC", minWidth: 200, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 },
    { field: "type", headerName: "Tipe", width: 120 },
    ...(isAdmin
      ? [
        {
          field: "actions",
          headerName: "Action",
          width: 100,
          sortable: false,
          filterable: false,
          renderCell: (params: GridRenderCellParams) => (
            <ActionButtonTable
              items={[
                {
                  key: "delete",
                  type: "delete",
                  onClick: () => {
                    modal.confirm({
                      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                      description: `Hapus user dari bidang ini?`,
                      onOk: () => {
                        unassignUserMutation.mutate([params.row.userId]);
                      },
                    });
                  },
                },
              ]}
            />
          ),
        },
      ]
      : []),
  ];

  const columnsIku: GridColDef[] = [
    { field: "code", headerName: "Kode IKU", width: 120 },
    { field: "name", headerName: "Nama IKU", minWidth: 200, flex: 1 },
    { field: "unit", headerName: "Unit", width: 150 },
    { field: "isDirectInput", headerName: "Direct Input", width: 120 },
    ...(isAdmin
      ? [
        {
          field: "actions",
          headerName: "Action",
          width: 100,
          sortable: false,
          filterable: false,
          renderCell: (params: GridRenderCellParams) => (
            <ActionButtonTable
              items={[
                {
                  key: "delete",
                  type: "delete",
                  onClick: () => {
                    modal.confirm({
                      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                      description: `Putuskan hubungan IKU dari bidang ini?`,
                      onOk: () => {
                        unassignIkuMutation.mutate([params.row.ikuId]);
                      },
                    });
                  },
                },
              ]}
            />
          ),
        },
      ]
      : []),
  ];

  const columnsComponent: GridColDef[] = [
    { field: "code", headerName: "Kode Komponen", width: 150 },
    { field: "name", headerName: "Nama Komponen", minWidth: 200, flex: 1 },
    { field: "dataType", headerName: "Tipe Data", width: 120 },
    { field: "sourceType", headerName: "Sumber Data", width: 120 },
    { field: "periodType", headerName: "Periode", width: 120 },
    { field: "hasBreakdown", headerName: "Breakdown", width: 120 },
    ...(isAdmin
      ? [
        {
          field: "actions",
          headerName: "Action",
          width: 100,
          sortable: false,
          filterable: false,
          renderCell: (params: GridRenderCellParams) => (
            <ActionButtonTable
              items={[
                {
                  key: "delete",
                  type: "delete",
                  onClick: () => {
                    modal.confirm({
                      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                      description: `Putuskan hubungan IKP dari bidang ini?`,
                      onOk: () => {
                        unassignComponentMutation.mutate([params.row.componentId]);
                      },
                    });
                  },
                },
              ]}
            />
          ),
        },
      ]
      : []),
  ];



  return (
    <Page
      loading={detailQuery.isLoading}
      title="Detail Bidang"
      breadcrumbs={[
        {
          label: "Bidang",
          path: paths.bidang.list,
        },
        {
          label: bidangInfo?.name || "Detail",
          path: null,
        },
      ]}
    >
      {/* <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(paths.bidang.list)}
          sx={{ fontWeight: 700 }}
        >
          Kembali ke Daftar
        </Button>
      </Box> */}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.04)",
              border: "1px solid #e2e8f0",
              borderLeft: "6px solid",
              borderLeftColor: "primary.main",
              background: "linear-gradient(to right, #ffffff, #fafafa)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Typography variant="h6" fontWeight={800} color="text.primary">
                Informasi Bidang
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Kode Bidang
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mt: 0.5 }}>
                    {bidangInfo?.code || "-"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Box>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Nama Bidang
                  </Typography>
                  <Typography variant="body1" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
                    {bidangInfo?.name || "-"}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px dashed #e2e8f0" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Deskripsi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                    {bidangInfo?.description || "Tidak ada deskripsi."}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>


        <Grid size={{ xs: 12 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
              <Tab label={`User Assigned (${mappedUsers.length})`} sx={{ fontWeight: 700 }} />
              <Tab label={`Linked IKU (${mappedIkus.length})`} sx={{ fontWeight: 700 }} />
              <Tab label={`Linked IKP (${mappedComponents.length})`} sx={{ fontWeight: 700 }} />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Daftar User di Bidang
                </Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenUserModal(true)}
                  >
                    Kelola User
                  </Button>
                )}
              </Box>
              <DataTable
                loading={usersQuery.isLoading}
                rows={mappedUsers}
                columns={columnsUser}
                hidePagination={true}
                paginationInfo={createPaginationInfo({
                  per_page: 1000,
                  total: mappedUsers.length,
                  page: 1,
                })}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Daftar IKU Bidang
                </Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenIkuModal(true)}
                  >
                    Kelola IKU
                  </Button>
                )}
              </Box>
              <DataTable
                loading={ikusQuery.isLoading}
                rows={mappedIkus}
                columns={columnsIku}
                hidePagination={true}
                paginationInfo={createPaginationInfo({
                  per_page: 1000,
                  total: mappedIkus.length,
                  page: 1,
                })}
              />
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Daftar IKP Bidang
                </Typography>
                {isAdmin && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpenComponentModal(true)}
                  >
                    Kelola IKP
                  </Button>
                )}
              </Box>
              <DataTable
                loading={componentsQuery.isLoading}
                rows={mappedComponents}
                columns={columnsComponent}
                hidePagination={true}
                paginationInfo={createPaginationInfo({
                  per_page: 1000,
                  total: mappedComponents.length,
                  page: 1,
                })}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Modals for Assignment */}
      <ModalAssignUser
        open={openUserModal}
        onClose={() => setOpenUserModal(false)}
        bidangId={idBidang}
        currentAssignUserIds={mappedUsers.map((u: { userId: string }) => u.userId)}
      />

      <ModalAssignIku
        open={openIkuModal}
        onClose={() => setOpenIkuModal(false)}
        bidangId={idBidang}
        currentAssignIkuIds={mappedIkus.map((i: { ikuId: string }) => i.ikuId)}
      />

      <ModalAssignComponent
        open={openComponentModal}
        onClose={() => setOpenComponentModal(false)}
        bidangId={idBidang}
        currentAssignComponentIds={mappedComponents.map((c: { componentId: string }) => c.componentId)}
      />
    </Page>
  );
};

export default BidangDetailPage;

