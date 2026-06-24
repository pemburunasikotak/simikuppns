import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  TextField,
  Button,
  Typography,
  // Grid,
  InputAdornment,
  IconButton,
  Alert,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useSession } from "@/app/_components/providers/session";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { loginSchema, TLoginFormData } from "../auth/login/schema";
import { zodResolver } from "@hookform/resolvers/zod";

const PortalLogin: React.FC = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get("error");
  const loading = session.status === "authenticating";

  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleLogin = (data: TLoginFormData) => {
    setSearchParams({ error: "" });
    session.signin({
      nip: data.nip,
      password: data.password,
    });
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      navigate(searchParams.get("callbackUrl") || "/");
    }
  }, [session.status, navigate, searchParams]);

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

      <Box sx={{ mb: 4, textAlign: "center", zIndex: 1 }}>
        <img
          src="/images/logo.png"
          alt="Logo"
          style={{
            height: "100px",
            width: "auto",
            marginBottom: "1rem",
            filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))"
          }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "white",
            textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
            letterSpacing: "1px",
          }}
        >
          Portal Login
        </Typography>
      </Box>

      <Card
        sx={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: "400px",
          zIndex: 1,
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            style={{
              fontSize: "1rem",
              fontWeight: "normal",
              textAlign: "center",
              color: "#333",
              marginBottom: "1.5rem",
            }}
          >
            Silakan login untuk mengakses Portal Aplikasi
          </Typography>

          {error ? (
            <Box sx={{ my: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : null}

          <form onSubmit={handleSubmit(handleLogin)}>
            <TextField
              label="NIP"
              variant="outlined"
              fullWidth
              {...register("nip")}
              error={!!errors.nip}
              helperText={errors.nip?.message}
              style={{ marginBottom: "1rem" }}
              InputProps={{
                sx: { borderRadius: '12px' }
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              style={{ marginBottom: "1rem" }}
              InputProps={{
                sx: { borderRadius: '12px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              style={{
                marginTop: "1rem",
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
              type="submit"
            >
              {loading ? "Loading..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PortalLogin;
