import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  TextField,
  Button,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Box,
} from "@mui/material";
import { useSession } from "@/app/_components/providers/session";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { loginSchema, TLoginFormData } from "../login/schema";
import { zodResolver } from "@hookform/resolvers/zod";

const Component: React.FC = () => {
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
      navigate(searchParams.get("callbackUrl") || "/dashboard");
    }
  }, [session.status, navigate, searchParams]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/bg_login.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          zIndex: -1,
        }}
      />
      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{ padding: "1rem", height: "100%", width: "100vw" }}
      >
        <Grid
          size={{ xs: 12, md: 4 }}
          style={{ display: "flex", justifyContent: "center", alignSelf: "center" }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <Typography
              style={{
                marginBottom: "1rem",
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#333",
                textAlign: 'center'
              }}
            >
              Login
            </Typography>
            <Typography
              style={{
                fontSize: "1rem",
                fontWeight: "normal",
                textAlign: 'center',
                color: "#333",
                marginBottom: "1.5rem",
              }}
            >
              Selamat datang di SIM PROKER
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
                color="secondary"
                fullWidth
                style={{ marginTop: "1rem" }}
                type="submit"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Component;
