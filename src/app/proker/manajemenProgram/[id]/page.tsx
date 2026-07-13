import { useParams, useNavigate } from "react-router";
import { Typography, Box, Paper, Button, Grid, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import useGetDefaultProgram from "../_hooks/use-get-default-program";

const DetailDefaultProgramPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: programData, isLoading } = useGetDefaultProgram(id as string, !!id);
  const programInfo = programData?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Page
      title="Detail Program Default"
      breadcrumbs={[
        {
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/manajemenProgram",
        },
        {
          label: "Detail",
          path: null,
        },
      ]}
    >
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6">
                Informasi Program Default
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />} 
                onClick={() => navigate("/proker/manajemenProgram")}
              >
                Kembali
              </Button>
            </Box>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Kode IKU
                </Typography>
                <Typography variant="body1">{programInfo?.ikuCode || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Judul Program
                </Typography>
                <Typography variant="body1">{programInfo?.title || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Deskripsi
                </Typography>
                <Typography variant="body1">{programInfo?.description || "-"}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default DetailDefaultProgramPage;
