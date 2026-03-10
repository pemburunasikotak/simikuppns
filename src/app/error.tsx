import type { FC, ReactElement } from "react";
import { useRouteError, useNavigate } from "react-router";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const AppError: FC = (): ReactElement => {
  const error = useRouteError() as Response;
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <ReportProblemIcon color="error" sx={{ fontSize: 64 }} />

          <Typography variant="h3" fontWeight="bold">
            {error.status === 403 ? "403 - Dilarang" : `Error`}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {error.status === 403
              ? "Anda tidak memiliki akses ke halaman ini."
              : error.statusText || "Terjadi kesalahan."}
          </Typography>

          <Button variant="contained" onClick={handleGoBack}>
            Kembali
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AppError;
