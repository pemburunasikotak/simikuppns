import { Box, Typography, Button, Container, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate(); // Remove if not using React Router

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
          <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />
          <Typography variant="h2" component="h1" fontWeight="bold">
            404
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Halaman yang kamu cari tidak ditemukan.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Kembali ke Beranda
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
