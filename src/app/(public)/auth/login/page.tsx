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
import { loginSchema, TLoginFormData } from "./schema";
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
      email: data.email,
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
      {/* <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <img
          src="/images/logo_transparan.png"
          alt="Logo"
          style={{
            width: "400px",
            height: "auto",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div> */}
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
              Selamat datang di SIM IKU
            </Typography>
            {error ? (
              <Box sx={{ my: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            ) : null}
            <form onSubmit={handleSubmit(handleLogin)}>
              <TextField
                label="email"
                variant="outlined"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                loading={loading}
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "1rem" }}
                type="submit"
              >
                Login
              </Button>
            </form>
          </div>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 8 }} style={{ alignSelf: "center" }}>
          <div
            style={{
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              height: "100%",
            }}
          >
            <Typography
              textAlign="start"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "1rem",
              }}
            >
              Pendhopo Ayem Tentrem
            </Typography>
            <Typography
              textAlign="start"
              style={{
                fontSize: "5rem",
                fontWeight: "bold",
                color: "white",
              }}
            >
              JAVANESE <br /> OUTDOOR VENUE
            </Typography>
          </div>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default Component;
