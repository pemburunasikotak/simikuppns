import { useNavigate } from 'react-router-dom';
import { paths } from '../commons/constants/paths';
import { Typography, Grid, Card, CardContent, CardActionArea, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Blur */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/bg_login.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.1)", // Prevent blurred edges from leaking
          zIndex: -1,
        }}
      />
      {/* Overlay to darken background slightly for better contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: -1,
        }}
      />

      <Box sx={{ mb: 6, textAlign: "center", zIndex: 1 }}>
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{
            height: "120px",
            width: "auto",
            marginBottom: "1rem",
            filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))"
          }}
        />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "white",
            textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          Portal Aplikasi
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            mt: 1,
            fontWeight: 400,
            textShadow: "0px 1px 5px rgba(0,0,0,0.5)",
          }}
        >
          Pilih sistem yang ingin Anda akses
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: "800px", px: 3, zIndex: 1 }}>
        {/* Card for SIM IKU */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
                background: "rgba(255, 255, 255, 0.15)",
              },
            }}
          >
            <CardActionArea onClick={() => navigate(paths.auth.login)} sx={{ p: 4, height: "100%" }}>
              <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "50%",
                    p: 2,
                    display: "flex",
                    mb: 3,
                    boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                  }}
                >
                  <DashboardIcon sx={{ fontSize: 48, color: "white" }} />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "white", mb: 2 }}>
                  SIM IKU
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
                  Sistem Informasi Manajemen Indikator Kinerja Utama.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Card for SIM MASTER */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
                background: "rgba(255, 255, 255, 0.15)",
              },
            }}
          >
            <CardActionArea onClick={() => alert('SIM PROKER - Segera Hadir')} sx={{ p: 4, height: "100%" }}>
              <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box
                  sx={{
                    backgroundColor: "secondary.main",
                    borderRadius: "50%",
                    p: 2,
                    display: "flex",
                    mb: 3,
                    boxShadow: "0 4px 20px rgba(156, 39, 176, 0.4)",
                  }}
                >
                  <SettingsSuggestIcon sx={{ fontSize: 48, color: "white" }} />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "white", mb: 2 }}>
                  SIM PROKER
                </Typography>
                <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
                  Sistem Informasi Manajemen Proker (Segera Hadir).
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}