import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  Person,
  LockReset,
  Visibility,
  VisibilityOff,
  AccountCircle,
  BadgeOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import useChangeProfilePassword from "@/app/(protected)/_hooks/use-change-profile-password";

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
  user: { name?: string; email?: string; nip?: string } | null | undefined;
}

const ProfileDialog = ({ open, onClose, user }: ProfileDialogProps) => {
  const changePassword = useChangeProfilePassword();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  const handleSubmit = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    changePassword.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setSuccessMsg("Password berhasil diubah.");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: unknown) => {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          setErrorMsg(
            axiosErr?.response?.data?.message || "Gagal mengubah password. Periksa kembali password lama Anda."
          );
        },
      }
    );
  };

  // Determine initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Person color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Profil Saya
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* ── User Info Card ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
            py: 2,
            px: 3,
            borderRadius: 2,
            bgcolor: "primary.50",
            border: "1px solid",
            borderColor: "primary.100",
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              fontSize: "1.6rem",
              fontWeight: 700,
              bgcolor: "primary.main",
            }}
          >
            {initials}
          </Avatar>

          {/* Name */}
          {user?.name && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <AccountCircle fontSize="small" color="action" />
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
            </Box>
          )}

          {/* NIP */}
          {user?.nip && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <BadgeOutlined fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                NIP: {user.nip}
              </Typography>
            </Box>
          )}

          {/* Email */}
          {user?.email && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <EmailOutlined fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LockReset fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              GANTI PASSWORD
            </Typography>
          </Box>
        </Divider>

        {/* ── Error Message ── */}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        {/* ── Success Snackbar ── */}
        <Snackbar
          open={Boolean(successMsg)}
          autoHideDuration={4000}
          onClose={() => setSuccessMsg("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSuccessMsg("")} sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        </Snackbar>

        {/* ── Password Fields ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Password Lama"
            type={showOld ? "text" : "password"}
            size="small"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowOld((v) => !v)} edge="end">
                    {showOld ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password Baru"
            type={showNew ? "text" : "password"}
            size="small"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="Minimal 6 karakter"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNew((v) => !v)} edge="end">
                    {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Konfirmasi Password Baru"
            type={showConfirm ? "text" : "password"}
            size="small"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && confirmPassword !== newPassword}
            helperText={
              confirmPassword.length > 0 && confirmPassword !== newPassword
                ? "Password tidak cocok"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirm((v) => !v)} edge="end">
                    {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose} disabled={changePassword.isPending}>
          Tutup
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={changePassword.isPending}
          startIcon={changePassword.isPending ? <CircularProgress size={16} /> : <LockReset />}
        >
          {changePassword.isPending ? "Menyimpan..." : "Simpan Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
