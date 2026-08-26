import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  DashboardOutlined,
  CheckCircleOutline,
  PlayCircleOutline,
  AccountBalanceWalletOutlined
} from "@mui/icons-material";
import { useGetProkerDashboard } from "./_hooks/use-get-dashboard";
import StructureView from "./_components/structure-view";
import { useMemo } from "react";
import { ProkerSessionUser } from "@/libs/localstorage/proker-session";

export default function ProkerDashboardPage() {
  const { data, isLoading, isError, error } = useGetProkerDashboard();

  const sessionUser = ProkerSessionUser.get();
  const user = (sessionUser?.user as { roles?: { key: string }[] }) ?? {};
  const userRoleKeys = useMemo(() => user?.roles?.map((r: { key: string }) => r.key) || [], [user?.roles]);
  const isAdmin = userRoleKeys.includes("admin_sim_iku");

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Gagal memuat data dashboard. {(error as Error)?.message}</Alert>
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DashboardOutlined sx={{ mr: 1.5, color: 'text.secondary', fontSize: 32 }} />
        <Typography variant="h5" fontWeight="bold">Dashboard Proker</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2" fontWeight="bold">
                TOTAL PROGRAM
              </Typography>
              <Typography variant="h3" component="div" fontWeight="bold" color="primary.main">
                {data?.totalPrograms || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" fontWeight="bold">
                  SEDANG BERJALAN
                </Typography>
                <Typography variant="h3" component="div" fontWeight="bold" color="info.main">
                  {data?.runningPrograms || 0}
                </Typography>
              </Box>
              <PlayCircleOutline sx={{ color: 'info.main', fontSize: 40, opacity: 0.2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" fontWeight="bold">
                  SELESAI
                </Typography>
                <Typography variant="h3" component="div" fontWeight="bold" color="success.main">
                  {data?.completedPrograms || 0}
                </Typography>
              </Box>
              <CheckCircleOutline sx={{ color: 'success.main', fontSize: 40, opacity: 0.2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" fontWeight="bold">
                  REALISASI ANGGARAN
                </Typography>
                <Typography variant="h3" component="div" fontWeight="bold" color="primary.main">
                  {data?.totalBudget || 0}
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    Persentase Penyelesaian Keseluruhan
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1, bgcolor: 'grey.200', borderRadius: 5, height: 10 }}>
                      <Box
                        sx={{
                          width: `${data?.completionPercentage || 0}%`,
                          bgcolor: 'secondary.main',
                          height: '100%',
                          borderRadius: 5
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary" fontWeight="bold">
                        {data?.completionPercentage || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <AccountBalanceWalletOutlined sx={{ color: 'primary.main', fontSize: 40, opacity: 0.2 }} />
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="subtitle2" fontWeight="bold">
                  TERTUNDA
                </Typography>
                <Typography variant="h3" component="div" fontWeight="bold" color="warning.main">
                  {data?.delayedPrograms || 0}
                </Typography>
              </Box>
              <WarningAmberOutlined sx={{ color: 'warning.main', fontSize: 40, opacity: 0.2 }} />
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" fontWeight="bold">Total Anggaran</Typography>
              </Box>
              <Typography variant="h4" color="text.primary" fontWeight="bold">
                {formatCurrency(data?.masterBudget || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>Program Berdasarkan Status</Typography>
              {data?.programsByStatus?.map((statusItem, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body1" fontWeight="medium">{statusItem.status}</Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">{statusItem.count}</Typography>
                </Box>
              ))}
              {(!data?.programsByStatus || data.programsByStatus.length === 0) && (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">Belum ada data status program.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>

      {isAdmin && <StructureView />}
    </Box>
  );
}

